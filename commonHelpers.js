import{i as d,S as v,a as g}from"./assets/vendor-89feecc5.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerpolicy&&(s.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?s.credentials="include":t.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}})();const w="https://pixabay.com/api/",b="41633959-4ab3a3c79df0d7e6ffc2251eb",L=document.querySelector(".form"),u=document.querySelector(".photo-container"),i=document.querySelector(".loader"),l=document.querySelector(".load-more");let p,n=1,m="",y=0,h=0;l.style.display="none";const P=()=>{const e=new URL(w);return e.searchParams.append("key",b),e.searchParams.append("image_type","photo"),e.searchParams.append("orientation","horizontal"),e.searchParams.append("safesearch","true"),e.searchParams.append("page",n),e.searchParams.append("per_page",40),e};L.addEventListener("submit",async e=>{e.preventDefault();const o=e.currentTarget.elements[0].value;if(o.length<4)alert("Sorry, Yours length is not enough. Min 4 letters.");else{i.style.display="block",l.style.display="none",m=o.toLowerCase(),n=1;try{await f()}catch(a){console.error(a)}}});l.addEventListener("click",async()=>{i.style.display="block",n++;try{await f()}catch(e){console.error(e)}});const k=async()=>{const e=P();e.searchParams.append("q",m);try{const o=await g.get(e.toString());if(o.status===200)return o.data;throw new Error("Request is not okay")}catch(o){console.error(o)}},f=async()=>{try{const e=await k();if(e.hits.length===0&&n===1){d.error({message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight"}),i.style.display="none";return}else if(e.hits.length===0){d.info({message:"We're sorry, but you've reached the end of search results.",position:"topRight"}),i.style.display="none",l.style.display="none";return}if(y=e.totalHits,n===1){const a=document.querySelector(".photo-card");a&&(h=a.getBoundingClientRect().height)}const o=e.hits.reduce((a,r,t)=>a+`<div class="photo-card">
                    <div class="photo">
                        <a href="${r.largeImageURL}" data-lightbox="gallery-${t}">
                            <img src="${r.webformatURL}" alt="${r.tags}" width="360" height="200" />
                        </a>
                    </div>
                    <div class="info-container">
                        <div class="label-value">
                            <div class="label-likes">Likes</div>
                            <div class="value">${r.likes}</div>
                        </div>
                        <div class="label-value">
                            <div class="label-likes">Views</div>
                            <div class="value">${r.views}</div>
                        </div>
                        <div class="label-value">
                            <div class="label-likes">Comments</div>
                            <div class="value">${r.comments}</div>
                        </div>
                        <div class="label-value">
                            <div class="label-likes">Downloads</div>
                            <div class="value">${r.downloads}</div>
                        </div>
                    </div>
                </div>`,"");n===1?u.innerHTML=o:u.innerHTML+=o,i.style.display="none",l.style.display=n*40>=y?"none":"block",p=new v(".photo a",{captionsData:"alt",captionPosition:"bottom",captionDelay:250}),p.refresh(),window.scrollBy({top:h*2,behavior:"smooth"})}catch(e){console.error(e)}};window.scrollBy(0,window.innerHeight);window.scrollBy(0,-window.innerHeight);window.scrollBy({top:100,left:100,behavior:"smooth"});
//# sourceMappingURL=commonHelpers.js.map
