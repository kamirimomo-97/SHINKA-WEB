// Conservative interior paths. Pixel classification and erosion remove banks and foliage.
export const WATER_OUTLINES=[
 'M348 493C335 503 331 522 326 542L317 583 318 597 337 599C339 575 342 553 347 530L360 495Z',
 'M899 699C918 704 933 718 938 747L952 808C958 824 965 838 970 849V866C949 850 937 824 931 800L914 752C909 732 900 717 894 710Z',
 'M901 735C904 758 901 785 893 810L901 816C915 788 914 756 911 738Z'
];
const smooth=(lo,hi,v)=>{const x=Math.max(0,Math.min(1,(v-lo)/(hi-lo)));return x*x*(3-2*x);};
export function waterConfidence(r,g,b){const light=.2126*r+.7152*g+.0722*b;
 const cyan=smooth(25,55,b-r)*smooth(10,25,g-r)*smooth(85,135,light)*smooth(-2,8,b-g);
 const foam=smooth(170,205,Math.min(r,g,b))*smooth(12,20,b-r)*smooth(-12,-2,g-r);
 const whiteFoam=smooth(225,242,Math.min(r,g,b))*smooth(0,6,b-r)*smooth(-12,-4,g-r);return Math.max(cyan,foam,whiteFoam);
}

// Interior water corridors in the new portrait environment, excluding every landing.
export const MOBILE_WATER_OUTLINES=[
 'M231 416C213 442 198 466 186 497L169 499C179 467 198 436 220 419Z',
 'M767 850C801 855 816 882 825 935L837 1010 826 1050C815 986 813 924 796 897L776 878Z',
 'M788 1456C815 1476 827 1515 837 1554V1650L825 1644C824 1559 811 1502 784 1478Z'
];

// Water interiors only in the user's integrated reference composition.
export const REFERENCE_WATER_OUTLINES=[
 'M230 678C218 694 205 714 193 737L181 745C191 717 209 689 222 680Z',
 'M849 936C880 937 900 949 908 974L935 1043V1091L926 1079C910 1044 900 1000 887 980L851 958Z',
 'M891 965C908 977 917 1006 921 1040L928 1080 917 1073C910 1041 904 1000 887 980Z'
];
