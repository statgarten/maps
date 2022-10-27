한반도의 행정구역 경계를 SVG, GeoJSON, TopoJSON으로 제공합니다. 행정구역 경계는 [통계청 SGIS 오픈 API](https://sgis.kostat.go.kr/developer/html/main.html)를 통해 수집하였습니다. 2020년(가장 최신) 행정구역 경계를 아래와 같이 제공합니다. 

현재 로컬 환경에서 직접 구축한 PostGIS 공간데이터베이스에서 CLI 를 활용하여 정제된 자료를 제공하지만 `Node.js`를 활용한 소스코드를 첨부할 예정입니다.

- `./simplified/` 폴더 내에 `mapshaper` 패키지를 활용하여 간소화된 행정구역 경계를 `.svg`, `.geojson` 형식으로 제공합니다.

- `./raw/` 폴더 내에 SGIS에서 제공하는 API 결과를 그대로 제공합니다.

## Tools

- [mapshaper](https://github.com/mbloch/mapshaper): GeoJSON 포맷으로 저장된 행정구역 경계 정보를 `Visvalingam / weighted area` 방식으로 단순화한 후 TopoJSON, `.shp` 파일로 변환.

- [PostGIS](https://postgis.net): UTM-K(EPSG:5179) 좌표계로 제공되는 행정구역 경계 정보를 저장하고 이를 WGS84(EPSG:4326) 좌표계로 변환한 후, GeoJSON 포맷으로 쿼리 결과를 저장.
