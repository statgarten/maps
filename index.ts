import dotenv from 'dotenv'
import axios from 'axios';
import { parseFromWK } from 'wkt-parser-helper';
import proj4 from 'proj4';
import fs from 'fs';

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
          'consumer_key': process.env.SGIS_CK,
          'consumer_secret': process.env.SGIS_CS,
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
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

function parseBorders(borders: Array<Border>) {
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

let accessToken = await getAuth();
let borders = await getBorders(accessToken!, undefined);
let tBorders = parseBorders(borders!);

fs.writeFile('./raw/전국_시도_경계.json', tBorders, 'utf8', err => {
  if (err) {
    console.log(err);
  } else {
    console.log('The file was saved to ./raw/전국_시도_경계.json');
  }
});

// const epsg5179 = 'PROJCS["Korea 2000 / Unified CS",GEOGCS["Korea 2000",DATUM["Geocentric_datum_of_Korea",SPHEROID["GRS 1980",6378137,298.257222101],TOWGS84[0,0,0,0,0,0,0]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4737"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",38],PARAMETER["central_meridian",127.5],PARAMETER["scale_factor",0.9996],PARAMETER["false_easting",1000000],PARAMETER["false_northing",2000000],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AUTHORITY["EPSG","5179"]]';
// const epsg4326 = "EPSG:4326";
// let projectedBorders = proj4(epsg5179, epsg4326, tBorders);
// console.log(projectedBorders);

