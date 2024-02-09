import { diskStorage } from 'multer';

const fileName = (req, file, callback) => {
  callback(null, file.originalname);
};

export const fileStorage = diskStorage({
  destination: './db_images/promo', //если не создана, то создаст
  filename: fileName, //имя файла от клиента взять и записать также на сервер
});
