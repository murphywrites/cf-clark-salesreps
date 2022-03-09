import React, { useEffect, useState } from 'react';
import axios from 'axios'

const SalesRepCard = ({post, currentState, areaCodeSearchValue}) => {
    const {Name, Phone, email, areacodes} = post.acf
    const photoId = post.featured_media;
    const stateAndAreaCodeArray = areacodes.split(";")
    const areaCodeArray = stateAndAreaCodeArray.map(item => item.split(":")[1])
    const [photoUrl, setPhotoUrl] = useState("");
    const [visible, setVisible] = useState(true)
    const [areaCodeCheck, setAreaCodeCheck] = useState([])
 
    
    useEffect( () => {
        console.log(areaCodeSearchValue)
        const getAreaCodeArray = (array) => {
            // array.join(",")
            const arrayString = array.join(",").trim().split(",")
            arrayString.pop()
            return arrayString.map(item=>item.trim())
            
        }

        axios.get(`http://cfclarkc.w32.wh-2.com/wpdev/wp-json/wp/v2/media/${photoId}`)
        .then( res =>
            setPhotoUrl(res.data.media_details.sizes.full.source_url)
        )
        .catch(err=> 
            console.log(err)
        )

        let statesArray = stateAndAreaCodeArray.map(item => {
            return item.split(":")[0]
        })
        statesArray = statesArray.filter(state => state !== "")

        setAreaCodeCheck(getAreaCodeArray(areaCodeArray))
        console.log("code check",areaCodeCheck)
        console.log(areaCodeSearchValue)
       
       currentState !== "" && setVisible(statesArray.includes(currentState))
       areaCodeSearchValue !== "" && setVisible(areaCodeCheck.includes(areaCodeSearchValue.toString())) 
    }, [currentState, areaCodeSearchValue])
        
    
    

    return (
<>
        { visible && 
    <div className="card" >

            <div className="img-and-contact">
           <div className="imgWrapper">
              <img className="headshot" src={photoUrl}  style={{height:"100%", borderRadius:"2000px"}}/>
        </div>
          <div className="contact-container">
            <h2>{Name}</h2>
            <a href={"tel:"+{Phone}}>{Phone}</a> <br />
            <a href={"mailto:"+{email}}>{email}</a> <br />
                 
          </div> 
          </div>
          
         <div className="territory">
          <h3>Territory Area Codes:</h3>
                {}
                {stateAndAreaCodeArray.map(line => {
                    return(
                        <div>{line}</div>
                    )
                })}
          </div>





          </div> 

               

        }
            </>

    );
    }
export default SalesRepCard;
