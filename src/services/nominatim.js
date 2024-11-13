import axios from 'axios'

let nominatim = {
  search : function(query, fThen, getOriginals = false, nbRes=3){
    try{
      if(query == "" || query == " " || query == null) return fThen({ error: false, data: [] })
      axios.get('https://nominatim.openstreetmap.org/search?q=' 
                + query + "&format=json&addressdetails=1", 
                { withCredentials: false, timeout: 5000 })
            .then( res => {                
                if(res.data.length == 0) return fThen({ error: false, data: [] })

                let places = []
                console.log("res nominatim", res.data)
                //this.loadPlaces = false
                res.data.forEach(el => {
                  if(places.length < nbRes)
                  // if(el.type == "city" 
                  // || el.type == "administrative" 
                  // || el.type == "attraction"
                  // || el.type == "public_building"
                  // || el.type == "postcode"){
                      if(el.address != null){
                        let city =  el.address.city != null 
                                ?  el.address.city 
                                : (el.address.village != null ? el.address.village : "")
                        
                        if(getOriginals){
                          places.push(el)
                        }else{
                          let dname = el.display_name.substr(0, 40) + (el.display_name.length > 40 ? '...' : '')
                          places.push({ text : dname,
                                        lat: el.lat,
                                        lng: el.lon,
                                        city: city })
                        }
                      }
                  //}
                });

                fThen({ error: false, data: places })
            })
            .catch(res =>{
              console.log("error 1 nominatim.search()", res)
              fThen({ error: true, data: null })
            })
    }catch(e){
      console.log("error 2 nominatim.search()", e)

      fThen({ error: true, data: null })
    }
  }
}

export default nominatim