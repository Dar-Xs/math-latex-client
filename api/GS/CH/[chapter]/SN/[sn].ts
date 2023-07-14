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

function base64IfNull(str: string | undefined, blob: Buffer) {
  if (str) {
    return str;
  } else {
    return 'data:image/png;base64,' + Buffer.from(blob).toString('base64');
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const chapter = parseInt(req.query.chapter as string);
  const sn = parseInt(req.query.sn as string);

  const PK: TableStore.PrimaryKeyInput = [
    { CHAPTER: Long.fromNumber(chapter) },
    { SN: Long.fromNumber(sn) },
  ];

  const params = {
    tableName: 'IMG_GS',
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
      question: base64IfNull(data.QUESTION, data.IMG0),
      choices: [
        base64IfNull(data.CHOICE1, data.IMG1),
        base64IfNull(data.CHOICE2, data.IMG2),
        base64IfNull(data.CHOICE3, data.IMG3),
        base64IfNull(data.CHOICE4, data.IMG4),
      ],
      hint: base64IfNull(data.HINT, data.IMG5),
      difficulty: data.DIFF,
    },
  });
}
