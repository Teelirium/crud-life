import express from 'express';
import { ImageApiResponse } from '../../data/ImageObj/types';
import { wait } from '../../util';

const router = express.Router();

router.get('/images', async (req, res) => {
  const { images } = globalThis;

  const page = Number(req.query.page ?? 0);
  const resp: ImageApiResponse = {
    items: [images[page]],
    hasMore: page < images.length - 1,
  };

  await wait(100);

  // return res.status(503).json({ message: 'Something went wrong' });

  return res.json(resp);
});

router.get('/clients', async (req, res) => {});

export default router;
