import S3 from "aws-sdk/clients/s3";

const BUCKET = "aws-shop-course-import";
const EXPIRATION_TIME = 120;

const s3 = new S3({ region: "eu-west-1" });

export const getSignedUrl = (name) => {
  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${name}`,
    Expires: EXPIRATION_TIME,
    ContentType: "text/csv",
  };

  return s3.getSignedUrl("putObject", params);
};
