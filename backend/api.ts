import nodeCrypto, { KeyObject } from 'node:crypto';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { prisma } from './lib/prisma';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));

const createKeys = () => {
  const { privateKey, publicKey } = nodeCrypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  return { privateKey, publicKey };
};

const { privateKey, publicKey } = createKeys();

const createJWT = (
  user: string,
  id: number,
  session: number,
  privateKey: KeyObject,
) => {
  const token = jwt.sign(
    {
      data: { user, id, session },
    },
    privateKey,
    { algorithm: 'RS256', expiresIn: '2h' },
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
  let sessionId = Math.floor(Math.random() * 1000000000);

  let result = await prisma.sessions.create({
    data: {
      sessionId: sessionId,
      userId: user.id,
      createdAt: Math.floor(Date.now() / (1000 * 60 * 60)),
    },
  });
  const token = createJWT(user.name, user.id, sessionId, privateKey);
  res.status(200).cookie('session', token).json('Success');
});

// app.post('/findUser', async(req:any, res:any)=> {
//   if (!req.body.id) {
//     res.status(400).json("Invalid user")
//   }
//   else {
//   let user = prisma.user.findFirst({where: {
//       id: req.body.id
//     },
//   select: {
//     name: true
//     e

//   }})
//     res.status(200).json(user)
//   }
// });

app.post('/logout', async (req: any, res: any) => {
  const token = req.headers['cookie'].split('session=')[1];
  await jwt.verify(token, publicKey, async function (err: any, decoded: any) {
    if (err) {
      res.status(400).json('Unauthorized');
    } else {
      let result = await prisma.sessions.findFirst({
        where: {
          userId: decoded.data.id,
          sessionId: decoded.data.session,
        },
      });
      if (result != null) {
        prisma.sessions.delete({
          where: { sessionId: decoded.data.session },
        });

        prisma.sessions.deleteMany({
          where: {
            createdAt: {
              lt: Math.floor(Date.now() / (1000 * 60 * 60) - 2),
            },
          },
        });
        res.status(200).json('Success');
      } else {
        res.status(400).json('Unauthorized');
      }
    }
  });
});

app.post('/purchase', async (req: any, res: any) => {
  const token = req.headers['cookie'].split('session=')[1];
  await jwt.verify(token, publicKey, async function (err: any, decoded: any) {
    if (err) {
      res.status(400).json('Unauthorized');
    } else {
      let result = await prisma.sessions.findFirst({
        where: {
          userId: decoded.data.id,
          sessionId: decoded.data.session,
        },
      });
      if (result == null) {
        res.status(400).json('Please login');
      }
      if (!req.body.items) {
        res.status(400).json('No products');
      } else {
        const items = req.body.items;
        items.forEach(async (item: any) => {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              id: item.id,
              amountAvailable: {
                decrement: item.amountBought,
              },
            },
          });
        });
        res.status(200).json('Success');
      }
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
