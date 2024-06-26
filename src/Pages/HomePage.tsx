import * as xlsx from 'xlsx'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card' 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useEffect, useState } from 'react'
import { Input } from '../components/ui/input'
import { Textarea } from "../components/ui/textarea"


//plus code
// const OpenLocationCode = require('open-location-code').OpenLocationCode;
 

 

//npm i --save-dev @types/open-location-code
//install for typescript

//react query
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { addPlaceRow, fetchSample } from '../api/api'

const HomePage = () => {

  const [tableData, setTableData] = useState<any>(null)

  // const [singleRow, setSingleRow] = useState<any>({})


  // https://www.geoapify.com/google-plus-code-as-a-location-code
  
  //H2PG+9H Mandaluyong, Metro Manila
  

  // type typeRow = {
  //   name: string,
  //   address: string,
  //   coords: string
  // }

  // const queryClient = useQueryClient()
  // const { data, isLoading } = useQuery({
  //   queryFn: () => fetchSample(),
  //   queryKey: ["getPlaces"]
  // })

  // const { mutateAsync: addRowPlaceMutation } = useMutation({
  //   mutationFn: (params) => addPlaceRow(params),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries()
  //   }
  // })

  useEffect(() => { 

    const fetchData = async() => { 

      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_ROOT}/places?destination=manila`) 
      
        const data = response.data
  
        console.log(data)
      } catch (error) {
        console.log("Error fetching: ", error)
      }

    }

    fetchData()
  
  }, [])
  
  const readExcel = (file:any) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)

      fileReader.onload = (e) => {
        const bufferArray = e.target?.result
        const wb = xlsx.read(bufferArray, { type: 'buffer'})
        const wsName = wb.SheetNames[0]
        const ws = wb.Sheets[wsName]
        const data = xlsx.utils.sheet_to_json(ws)

        resolve(data)
      }

      fileReader.onerror=((error) => { reject(error )})
    })

    promise.then((data) => {
    
      

      const convertKeysToLowerCase = (myObj:any) => {
        return myObj.map((obj:any) => {
          const newObj:any = {}
          for (let key in obj) {
             
            if (obj.hasOwnProperty(key)) {
              const lowered:string = key.toLocaleLowerCase()
              const loweredSplit = lowered.split(" ")

              let newKey
              if (loweredSplit.length > 1) { 

                newKey = loweredSplit.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join("")
                newKey = newKey.charAt(0).toLowerCase() + newKey.slice(1)
                console.log(newKey)
              } else {
                newKey = loweredSplit[0]
              }
 
              
              let value:any = obj[key]
              newObj[newKey] = value
            }

          }

          //make imgs to be array
          const makeArray  = []
          makeArray.push(newObj.imgs)
          newObj.imgs = makeArray

          // we convert coords (lat, lng) to point geometry (using lnt, lat)
          // format goes as POINT(${latLng[1]} ${latLng[0]})
          const parsePoint = JSON.parse(newObj.coords)
          // const pointGeometry = `POINT(${parsePoint[1]},${parsePoint[0]})`
          const pointGeometry = { type: 'Point', coordinates: [parsePoint[1],parsePoint[0]]}

          //point = { type: 'Point', coordinates: [39.807222,-76.984722]}

          newObj.coordsSpatial = pointGeometry
          
          return newObj
        })
      }

      const loweredKeysObjectArrayData = convertKeysToLowerCase(data)
      setTableData(loweredKeysObjectArrayData)
      console.log(loweredKeysObjectArrayData)
    })
     
  }

  const handleInputChange = (idx: number, rowName:string, tValue:string) => {
    
    const updatedRowData = [...tableData]
    updatedRowData[idx][rowName] = tValue
    
    setTableData(updatedRowData) 
  }

  const handleBulkUpload = async() => {

    const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_ROOT}/admin/bulkUpload`, tableData)
    const data = response.data
    console.log(data)
  }

 
  // const handleSingleRowInputs = (getSingleRow: string, inputText:string) => {
  //   console.log(getSingleRow)
  //   console.log(inputText)
    
  //   const newSingleRow = {...singleRow}
  //   newSingleRow[getSingleRow] = inputText
  //   setSingleRow(newSingleRow)
  //   console.log(singleRow)
  // }

  // const handleAddRow = (theRow: typeRow) => {
  //   console.log(singleRow, theRow)
  // }
  
  return (
    <>
      <div className='flex flex-col'>     
        <div> 
          <CardHeader>
            <CardTitle>Watatrip Bulk Upload</CardTitle>
          </CardHeader>
         
            
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>User Id</TableHead>
                <TableHead>Add Pics</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>City Province</TableHead>
                <TableHead>City ID</TableHead>
                <TableHead className='w-[500px]'>Description</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Landmark</TableHead>
                <TableHead>Must Try</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Img</TableHead>
                <TableHead>Imgs</TableHead>
                <TableHead>Coords</TableHead>
                <TableHead>Coords Spatial</TableHead>
                <TableHead>Contact Number</TableHead>
                {/*
                  name, address, type, location, cityProvince, cityId, description, email, landmark, mustTry, role, img, imgs, coords, coordsSpatial, contactNumber
                */}
              </TableRow>
            </TableHeader> 
            <TableBody>
              {
                tableData ?
                  tableData.map((row:any, index:number) => (
                    
                    <TableRow>  

                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.name} onChange={(e) => handleInputChange(index, "name",  e.target.value)} /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[40px]' value={row.userId} onChange={(e) => handleInputChange(index, "userId",  e.target.value)} /> </TableCell>
                      
                      <TableCell>
                        <Input type='file' className='w-[100px]' /> 
                      </TableCell>

                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.address} onChange={(e) => handleInputChange(index, "address",  e.target.value)}  /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.type} onChange={(e) => handleInputChange(index, "type",  e.target.value)}  /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.location} onChange={(e) => handleInputChange(index, "location",  e.target.value)} /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.cityProvince} onChange={(e) => handleInputChange(index, "cityProvince",  e.target.value)}  /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.cityId} onChange={(e) => handleInputChange(index, "cityId",  e.target.value)}  /> </TableCell>
                      <TableCell><Textarea className='w-[150px]' value={row.description} onChange={(e) => handleInputChange(index, "description",  e.target.value)} /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.email} onChange={(e) => handleInputChange(index, "email",  e.target.value)}  /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.landmark} onChange={(e) => handleInputChange(index, "landmark",  e.target.value)}  /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.mustTry} onChange={(e) => handleInputChange(index, "mustTry",  e.target.value)} /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.role} onChange={(e) => handleInputChange(index, "role",  e.target.value)}  /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.img} onChange={(e) => handleInputChange(index, "img",  e.target.value)}  /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.imgs} onChange={(e) => handleInputChange(index, "imgs",  e.target.value)} /> </TableCell>
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.coords} onChange={(e) => handleInputChange(index, "coords",  e.target.value)}  /> </TableCell>
                      <TableCell><div className='text-xs'>{JSON.stringify(row.coordsSpatial)}</div></TableCell>
                      {/* <TableCell><Input value={row.coordsSpatial} onChange={(e) => handleInputChange(index, "coordsSpatial",  e.target.value)}  /> </TableCell> */}
                      <TableCell><Input className='flex text-start text-xs w-[100px]' value={row.contactNumber} onChange={(e) => handleInputChange(index, "contactNumber",  e.target.value)}  /> </TableCell> 
                    
                    </TableRow> 
                  ))

                  : ""
              }

                    <TableRow>
                      <TableCell colSpan={17} className="w-full bg-gray-100">
                        
                        <CardHeader>
                          <Input type="file" onChange={(e:any) => { 
                            const file = e.target.files[0];
                            readExcel(file) 
                          }} />

                        </CardHeader>

                      </TableCell>
                    </TableRow>
                    {/*
                    
                    <TableRow>  
                      <TableCell><Input onChange={(e) => handleSingleRowInputs('name', e.target.value) } placeholder='name'/> </TableCell>
                      <TableCell><Input onChange={(e) => handleSingleRowInputs('address', e.target.value)} placeholder='address'/> </TableCell>
                      <TableCell><Input onChange={(e) => handleSingleRowInputs('coords', e.target.value)} placeholder='coords'/> </TableCell>
                      
                      <TableCell><Input   type="file" /></TableCell>  
                    </TableRow>
                    
                    */}
                

                    {/* <TableRow className='w-full bg-red-500'>
                        <TableHead colSpan={4} className='text-right'>

                          <Button className='mr-2' onClick={() => handleAddRow(singleRow)}>Add</Button>
                          <Button
                            onClick={async () => {
                              try {
                                await addRowPlaceMutation(singleRow)
                              } catch (error) {
                                console.log(error)
                              }
                            }}>
                              Add Mutation
                          </Button>
                        </TableHead>
                      
                    </TableRow> */}
                
              
              
            </TableBody>

          </Table>
          
          <CardFooter className='w-full flex justify-end pt-4'> 
            <Button onClick={handleBulkUpload} className='w-1/2'>Submit</Button>
          </CardFooter>
        </div>
        <div  >
          <CardContent className='text-xs text-opacity-50 text-left'>
            <pre>
              { JSON.stringify(tableData, null, 2) }
            </pre>
          </CardContent>
        </div>
      </div>
    </>
  )
}

export default HomePage