const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

async function generatePresignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
  return url;
}

module.exports = generatePresignedUrl;
