import dotenv from 'dotenv'
import axios from 'axios';
import { parseFromWK } from 'wkt-parser-helper';
import { promises as fsPromises } from 'fs';
import path from 'path';

dotenv.config();

type AccessToken = {
  "accessToken": string,
  "accessTimeout": string,
}

type AddressCode = {
  "y_coor": string,
  "full_addr": string,
  "x_coor": string,
  "addr_name": string,
  "cd": string,
  "pg": string,
}

type Border = {
  "id": string,
  "title": string,
  "wkt": string,
}

interface APIEndpointMeta {
  id: string;
  errMsg: string;
  errCd: number;
  trId: string;
};

interface AccessTokenEndpoint extends APIEndpointMeta {
  result: AccessToken;
};

interface AddressCodeEndpoint extends APIEndpointMeta {
  result: AddressCode[];
};

async function getAuth() {
  try {
    const { data, status } = await axios.get<AccessTokenEndpoint>('https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json',
      {
        params: {
          'consumer_key': process.env.CONSUMER_KEY,
          'consumer_secret': process.env.CONSUMER_SECRET,
        },
        headers: {
          Accept: 'application/json'
        }
      }
    );
    if (status === 200 && data.errCd === 0) {
      return data.result.accessToken;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

async function getBorders(access_token: string, cd: string | undefined) {
  // cd: undefined -> 전국의 시도 경계
  // cd: '11' -> 서울특별시의 시군구 경계
  // cd: '11240' -> 서울특별시 송파구 가락2동의 읍면동 경계
  try {
    const { data, status } = await axios.get<AddressCodeEndpoint>('https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json',
      {
        params: {
          'accessToken': access_token,
          'cd': cd,
          'pg_yn': 1,
        },
        headers: {
          Accept: 'application/json'
        }
      });

    if (status === 200 && data.errCd === 0 && Array.isArray(data.result)) {
      let borders: Array<Border> = data.result.map(
        (ac: AddressCode) => ({
          "id": ac.cd,
          "title": ac.addr_name,
          "wkt": ac.pg,
        })
      )
      return borders;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
  }
}

function bordersToJSON(borders: Array<Border>) {
  // Parses WKT borders to GeoJSON
  const transformedBorders = borders.map(
    (border: Border) => (
      {
        type: 'Feature',
        geometry: parseFromWK(border.wkt),
        properties: { "id": border.id, "title": border.title }
      }
    )
  );
  return JSON.stringify({ type: 'FeatureCollection', features: transformedBorders }, null, 4);
}

async function writeBordersToFile(filename: string, borders: Array<Border>) {
  try {
    const json = bordersToJSON(borders);
    await fsPromises.writeFile(filename, json, 'utf8');
    console.log(`Wrote ${filename} successfully`);
  } catch (error) {
    console.log(error);
  }
}

async function download(dirname: string = 'json', overwrite: boolean = true) {
  let accessToken = await getAuth();
  let borders = await getBorders(accessToken!, undefined);
  if (overwrite) {
    await writeBordersToFile(path.join(dirname, '전국_시도_경계.json'), borders!);
    borders!.forEach(async (b: Border) => {
      let borders = await getBorders(accessToken!, b.id);
      await writeBordersToFile(path.join(dirname, `${b.title}_시군구_경계.json`), borders!);
    });
  }
};

await download('json', true);

