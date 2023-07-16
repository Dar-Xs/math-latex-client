import { NextApiRequest, NextApiResponse } from 'next';
import TableStore from 'tablestore';
const Long = TableStore.Long;

const client = new TableStore.Client({
  accessKeyId: process.env.AccessKey_ID,
  accessKeySecret: process.env.AccessKey_Secret,
  endpoint: process.env.Endpoint,
  instancename: process.env.Instancename,
  maxRetries: 5, //默认20次重试，可以省略此参数。
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = req.query.db as string;
  const dbs: { [key: string]: string } = { GS: 'IMG_GS' };
  const tableName = dbs[db];
  if (tableName === undefined) {
    res.status(200).send({
      success: false,
      message: 'Invalid database requested',
      data: {},
    });
    return;
  }
  const chapter = parseInt(req.query.chapter as string);
  const sn = parseInt(req.query.sn as string);

  const PK: TableStore.PrimaryKeyInput = [
    { CHAPTER: Long.fromNumber(chapter) },
    { SN: Long.fromNumber(sn) },
  ];

  const params = {
    tableName: tableName,
    primaryKey: PK,
    maxVersions: 1, //最多可读取的版本数，设置为2即代表最多可读取2个版本。
  };

  await new Promise<TableStore.Row>((resolve, reject) => {
    client.getRow(params, (err, data) => {
      if (err || data.row === undefined) {
        reject(err);
      } else {
        resolve(data.row);
      }
    });
  })
    .then((data) => {
      const convert: { [key: string]: any } = {};
      if (!data.attributes) {
        error(res.status(200), '没有这一题');
        return;
      }

      data.attributes.forEach((attr) => {
        convert[attr.columnName] = attr.columnValue;
      });

      success(res, convert);
    })
    .catch((err) => {
      error(res.status(500), err.message);
    });
}

function error(res: NextApiResponse, message: string) {
  res.send({
    success: false,
    message: message,
    data: {},
  });
}

function success(res: NextApiResponse, data: any) {
  res.status(200).send({
    success: true,
    message: data.QUESTION === undefined ? 'png' : 'latex',
    data: {
      IMG0: base64Encode(data.IMG0),
      IMG1: base64Encode(data.IMG1),
      IMG2: base64Encode(data.IMG2),
      IMG3: base64Encode(data.IMG3),
      IMG4: base64Encode(data.IMG4),
      IMG5: base64Encode(data.IMG5),
      question: data.QUESTION,
      choices: [data.CHOICE1, data.CHOICE2, data.CHOICE3, data.CHOICE4],
      hint: data.HINT,
    },
  });
}

function base64Encode(blob: Buffer) {
  return 'data:image/png;base64,' + Buffer.from(blob).toString('base64');
}
