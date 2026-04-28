import nodeCrypto, { KeyObject } from 'node:crypto';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { prisma } from './lib/prisma';

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const createKeys = () => {
  const { privateKey, publicKey } = nodeCrypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  return { privateKey, publicKey };
};
const { privateKey, publicKey } = createKeys();
const createJWT = (data: any, privateKey: KeyObject) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: data,
    },
    privateKey,
    { algorithm: 'RS256' },
  );
  return token;
};

const dummyData = async () => {
  await prisma.product.createMany({
    data: [
      {
        name: 'alpha',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'beta',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'gamma',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'zeta',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'phi',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'Lorem',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'Ipsum',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'dolor',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'sit',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'amet',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'uno',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'dos',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'tres',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'cuatro',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
      {
        name: 'cinco',
        description: '',
        price: 20,
        amountAvailable: 99,
        interactions: 230,
      },
    ],
  });
};

//Create User
app.post('/createUser', async (req: any, res: any) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json('Please fill out all required fields.');
  }

  const user = await prisma.user.findFirst({
    where: { name: req.body.username },
  });
  if (user) {
    return res.status(400).json('Username already exists.');
  }

  const password = bcrypt.hashSync(req.body.password, 10);

  await prisma.user.create({
    data: {
      name: req.body.username,
      password: password,
      email: req.body.email,
    },
  });

  res.status(200).json('Success');
});

// Login
app.post('/login', async (req: any, res: any) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json('Please fill out all required fields.');
  }

  const user = await prisma.user.findFirst({
    where: { name: req.body.username },
  });
  if (!user) {
    return res.status(400).json('No user found.');
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(400).json('Incorrect password.');
  }

  const token = createJWT(req, privateKey);
  console.log(token);
  res.cookie('session', token);
  res.status(200).json('Success');
});

// Auth
app.post('/auth', async (req: any, res: any) => {
  //needs to check cookie that is sent in post using the rsa key
  const token = req.headers['cookie']?.split('JWT=')[1];
  jwt.verify(token, publicKey, (err: any) => {
    if (err) {
      res.status(400).json('Unauthorized');
    }
  });
});

app.get('/addProducts', async (req: any, res: any) => {
  await dummyData();
  res.status(200).json('products added');
});

app.get('/getProducts', async (req: any, res: any) => {
  let products = await prisma.product.findMany();
  res.status(200).json(products);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
