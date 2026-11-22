// The atlas rows overlap around the pointed crests. Keep the vertical extent
// of the principal connected silhouette, excluding detached neighbouring tips.
export function isolateSilhouette(pixels,width,height){
 const seen=new Uint8Array(width*height),queue=new Int32Array(width*height);let largest=0,bounds=[0,height-1];
 for(let start=0;start<seen.length;start++){
  if(seen[start]||pixels[start*4+3]<24)continue;
  let head=0,tail=1,minY=height,maxY=0;queue[0]=start;seen[start]=1;
  while(head<tail){const index=queue[head++],x=index%width,y=Math.floor(index/width);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||nx>=width||ny<0||ny>=height)continue;const next=ny*width+nx;if(!seen[next]&&pixels[next*4+3]>=24){seen[next]=1;queue[tail++]=next;}}
  }
  if(tail>largest){largest=tail;bounds=[minY,maxY];}
 }
 // A one-pixel allowance preserves antialiasing at the selected rank's tips.
 for(let y=0;y<height;y++)if(y<bounds[0]-1||y>bounds[1]+1)for(let x=0;x<width;x++)pixels[(y*width+x)*4+3]=0;
 return bounds;
}
