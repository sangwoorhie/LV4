// 사진 업로드.

const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const path = require('path');

const s3Client = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
});

// upload를 exports시킨다. 그리고 exports된것은 사진업로드를 필요로하는 서버 (./Routes/newspost.js)에서 받아서 사용한다.
// multer라는 객체를 upload로 받은거지만, 이 multer설정해주는것을 미들웨어로 뺀 것일뿐, 서버에 그냥 써도 된다.
// multerS3객체의 안에 어떤 것들을 설정해주는지가 중요하다.

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: '',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
});

module.exports = upload;


