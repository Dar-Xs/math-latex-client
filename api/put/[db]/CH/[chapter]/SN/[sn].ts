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
  const key = req.body.key as string;
  if (key !== process.env.AccessKey) {
    res.status(200).send({
      success: false,
      message: 'Invalid key',
      data: {},
    });
    return;
  }

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
    condition: new TableStore.Condition(
      TableStore.RowExistenceExpectation.IGNORE,
      null
    ),
    primaryKey: PK,
    updateOfAttributeColumns: [
      {
        PUT: [
          { QUESTION: req.body.QUESTION },
          { CHOICE1: req.body.CHOICE1 },
          { CHOICE2: req.body.CHOICE2 },
          { CHOICE3: req.body.CHOICE3 },
          { CHOICE4: req.body.CHOICE4 },
          { HINT: req.body.HINT },
        ],
      },
    ],
  };

  await new Promise<TableStore.Row>((resolve, reject) => {
    client.updateRow(params, (err, data) => {
      if (err || data.row === undefined) {
        console.log("error:", err);
        reject(err);
      } else {
        resolve(data.row);
        console.log(JSON.stringify(data));
      }
    });
  })
    .then((data) => {
      res.status(200).send({
        success: true,
        message: 'send',
        data: data,
      });
      console.log();
    })
    .catch((err) => {
      error(res.status(500), err.message);
      console.log(JSON.stringify(req.body));
      
    });
}

function error(res: NextApiResponse, message: string) {
  res.send({
    success: false,
    message: message,
    data: {},
  });
}


