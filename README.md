# 대한민구 행정경계 GeoJSON 및 SVG

대한민국 행정구역 경계를 SVG, GeoJSON으로 제공합니다. 행정구역 경계는 [통계청 SGIS 오픈 API](https://sgis.kostat.go.kr/developer/html/main.html)를 통해 수집하였습니다. 2020년(가장 최신) 행정구역 경계를 아래와 같이 제공합니다. 

- `./json/` 폴더 내에 [SGIS API](https://sgis.kostat.go.kr/developer/html/newOpenApi/api/dataApi/basics.html)에서 제공하는 JSON 형식의 행정구역 경계 데이터를 제공합니다.

- `./svg/` 폴더 내에 API 를 바탕으로 SVG 형식의 행정구역 경계 데이터를 제공합니다.

- `./svg/simple/` 폴더 내에 단순화한 행정구역 경계 데이터를 제공합니다.

## 사용법

- GitHub Repository 에서 직접 `.svg`, `.json` 파일을 다운로드 받습니다.
- SGIS API를 통해 직접 행정구역을 다운로드 받고 svg 파일을 만들기 위해서는 다음 과정이 필요합니다.
  - [SGIS API](https://sgis.kostat.go.kr/developer/html/newOpenApi/api/dataApi/basics.html)에서 CONSUMER_KEY, CONSUMER_SECRET 를 발급받습니다.
  - `.env.template` 을 `.env`로 복사합니다.
  - `.env` 파일에 발급받은 CONSUMER_KEY, CONSUMER_SECRET 를 입력합니다.
  - `npm install` 을 통해 의존하는 패키지를 설치합니다.
  - `npm run clean` 을 통해 현재 저장된 파일들을 지웁니다.
  - `npm compile` 을 통해 새로운 파일을 다운로드 받고 `svg` 파일을 컴파일합니다.

경계가 너무 단순화하다면 `package.json` 의 scripts 의 compile 명령어의 `1%` 를 더 큰 숫자로 수정한 후 compile 하십시오.
