import nodeCrypto from 'node:crypto';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma';

const app = express();
app.use(express.json());

const createJWT = (data: any) => {
  const { privateKey, publicKey } = nodeCrypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  const token = jwt.sign(
    {
      data: data,
    },
    publicKey,
    { expiresIn: '2h' },
  );
};
const Auth = () => {};

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

  res.status(200).json('Success');
});

// Delete user

app.get('/getProducts', async (req: any, res: any) => {
  res.status(200).json('test');
  let products = await prisma.product.findMany();
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
