<script lang="ts">
  import InlineSVG from "svelte-inline-svg";
  import Footer from "./lib/Footer.svelte";

  const maps = [
    { name: "강원도 시군구 경계", fileName: "강원도_시군구_경계.svg" },
    { name: "경기도 시군구 경계", fileName: "경기도_시군구_경계.svg" },
    { name: "경상남도 시군구 경계", fileName: "경상남도_시군구_경계.svg" },
    { name: "경상북도 시군구 경계", fileName: "경상북도_시군구_경계.svg" },
    { name: "광주광역시 시군구 경계", fileName: "광주광역시_시군구_경계.svg" },
    { name: "대구광역시 시군구 경계", fileName: "대구광역시_시군구_경계.svg" },
    { name: "대전광역시 시군구 경계", fileName: "대전광역시_시군구_경계.svg" },
    { name: "부산광역시 시군구 경계", fileName: "부산광역시_시군구_경계.svg" },
    { name: "서울특별시 시군구 경계", fileName: "서울특별시_시군구_경계.svg" },
    {
      name: "세종특별자치시 시군구 경계",
      fileName: "세종특별자치시_시군구_경계.svg",
    },
    { name: "울산광역시 시군구 경계", fileName: "울산광역시_시군구_경계.svg" },
    { name: "인천광역시 시군구 경계", fileName: "인천광역시_시군구_경계.svg" },
    { name: "전국 시도 경계", fileName: "전국_시도_경계.svg" },
    { name: "전라남도 시군구 경계", fileName: "전라남도_시군구_경계.svg" },
    { name: "전라북도 시군구 경계", fileName: "전라북도_시군구_경계.svg" },
    {
      name: "제주특별자치도 시군구 경계",
      fileName: "제주특별자치도_시군구_경계.svg",
    },
    { name: "충청남도 시군구 경계", fileName: "충청남도_시군구_경계.svg" },
    { name: "충청북도 시군구 경계", fileName: "충청북도_시군구_경계.svg" },
  ];
  const commit_hash = "8247e23ded70eb908a61dbe2b3db07599b4a21cc";
  const base_url = `https://raw.githubusercontent.com/statgarten/maps/${commit_hash}/svg/simple/`;
</script>

<main class="pb-16">
  <h1 class="my-8">Simplified Border SVGs for South Korea</h1>
  <div class="flex flex-col flex-wrap md:flex-row justify-center gap-4">
    {#each maps as { name, fileName }}
      <div
        class="flex flex-col items-center card transition ease-in-out delay-100 hover:scale-110"
      >
        <p class="text-dark">{name}</p>
        <InlineSVG
          src={base_url + fileName}
          alt={name}
          class="w-full h-auto fill-slate-500 stroke-white-900 hover:fill-slate-900 transition ease-in-out delay-10"
        />
      </div>
    {/each}
  </div>
</main>
<Footer />
