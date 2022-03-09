import React, { useEffect, useState } from 'react';
import SalesRepCard from './SalesRepCard'
import axios from 'axios'
import USAMap from "react-usa-map";



const Posts = () => {

  const initialConfig = {
    "IN": {
    fill: "#144691"
  },
  "IL": {
    fill: "#144691"
  },
  "WI": {
    fill: "#144691"
  },
  "MI": {
    fill: "#144691"
  },
  "KS": {
    fill: "#144691"
  },
  "NE": {
    fill: "#144691"
  },
  "MO": {
    fill: "#144691"
  },
  "IA": {
    fill: "#144691"
  },
  "ND": {
    fill: "#144691"
  },
  "SD": {
    fill: "#144691"
  },
  "MN": {
    fill: "#144691"
  },
  "AK": {
    fill: '#ffffff'
  },
  "HI": {
    fill: '#ffffff'
  },
 }
    const coveredStates = ["IN","IL","WI","MI","KS","NE","MO","IA","ND","SD","MN"
    ]

    const [posts, setPosts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentState, setCurrentState] = useState("");
    const [mapConfig, setMapConfig] = useState(initialConfig)
    const [areaCodeSearchValue, setAreaCodeSearchValue] = useState("")
    const [noAreaCodeMatches, setNoAreaCodeMatches] = useState(true)
    const [allAreaCodesArray, setAllAreaCodesArray] = useState([])


    useEffect(() => {

        const loadPosts = () => {
            axios.get('http://cfclarkc.w32.wh-2.com/wpdev/wp-json/wp/v2/salesreps')
            .then( res =>
                    setPosts(res.data),
                    setIsLoaded(true)
            )
            .catch(err => console.log(err))
        }

        const loadAllAreaCodesArray = (employeeData) => {
          const stateAndAreaCodesString = employeeData.map(employee => employee.acf.areacodes).join()

          

                    const stateAndAreaCodesArray1 = stateAndAreaCodesString.split(":").join().split(";")
                    var finalArray = []
                    stateAndAreaCodesArray1.forEach(item => {
                     finalArray = finalArray.concat(item.split(','))
                     finalArray = finalArray.map(item => item.trim())  
                    })
                    return finalArray

                    // const stateAndAreaCodeArray = areacodes.split(";")
                    // const areaCodeArray = stateAndAreaCodeArray.map(item => item.split(":")[1])
        }
 
    
        loadPosts();
        setAllAreaCodesArray(loadAllAreaCodesArray(posts))
        

   }, [currentState])

   useEffect(() => {

    setNoAreaCodeMatches(!allAreaCodesArray.includes(areaCodeSearchValue))

   }, [areaCodeSearchValue])

   const handleChange = evt => {
    setAreaCodeSearchValue(evt.target.value)
     }

    const mapChange = evt => {
      // setAreaCodeSearchIsOn(false)
      setAreaCodeSearchValue("")
        const stateName = evt.target.dataset.name
        
        const isCoveredState = (state) => {
          return state === stateName
        }
        
if (coveredStates.some(isCoveredState)) {
        setCurrentState(stateName)
        setMapConfig({...initialConfig,
        [stateName]: {fill: "#add8e6"}})
        } else {
          alert(`${stateName} is not a state CF-Clark currently covers, please choose a state in blue.`)
        }



    }

 
    return (
        <>
        <h1>Find a Sales Rep</h1>
        <h2>Click on Any Blue State to Find a CF-Clark Sales Rep in Your Area</h2>
        <USAMap className="map" customize={mapConfig} onClick={mapChange}/> 
        <br />
        <h4>Search by Area Code</h4>
        <input type="number" id="areaCode" value={areaCodeSearchValue} onChange={handleChange}/>
        {/* <button onClick={areaCodeFilter} >Search</button> */}
        
        <h3>State Selected : {currentState ? currentState : "none"}</h3>
       
        <div className="cards-container">
            
      {isLoaded  ? posts.map((post, index) => (
      <SalesRepCard key={post.id} post={post} areaCodeSearchValue={areaCodeSearchValue}  currentState={currentState} setCurrentState={setCurrentState}/>
     ))
    : <h2>Loading...</h2>}
    
    </div>

    {(areaCodeSearchValue !== "" & noAreaCodeMatches) ?
    <div><h4>No sales reps for that area code. Please use <a href="http://cfclarkc.w32.wh-2.com/wpdev/#contact" style={{textDecoration: "underline"}}>contact form (click here)</a> for inquiries about coverage.</h4></div> : null }
    </>
    );
}

export default Posts;
