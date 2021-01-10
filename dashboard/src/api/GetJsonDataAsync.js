//Imtiaj Ahmed. Department of Computer Science, University of Helsinki, Finland. January, 2021.
//License: GPL 3 or later
export async function GetJsonDataAsync (datapath) 
{
    const res = await fetch(`./Data/${datapath}`);
    const json = await res.json();
    console.log(datapath)
    return json;
}
export default {GetJsonDataAsync};