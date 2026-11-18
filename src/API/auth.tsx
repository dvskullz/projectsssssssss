export const loginApi = async (email: string, password: string) => {
  const response = await fetch(
    'https://luvo-api.testdev.in/v1/user/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic bHV2bzpsdXZvQCQxMjM0NUA=',
      },
      body: JSON.stringify({
        email,
        password,
        fcmToken: 'null',
      }),
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Invalid Credentials');
  }
  return data;
};

export const verifyOtpApi = async (payload:{
  id:string;
  otp:string;
  otpType:string;
}) =>{
 const response  =  await fetch(
    'https://luvo-api.testdev.in/v1/user/auth/verify-email-otp',
    {
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        Authorization: 'Basic bHV2bzpsdXZvQCQxMjM0NUA=',
      },
      body: JSON.stringify({
        id:payload.id,
        otp:payload.otp,
        otpType:payload.otpType,
      }),
    }
  );
  const data = await response.json();
  // console.log('Verify OTP API response:', data);
  if(!response.ok){
    throw new Error(data.message || 'Invalid OTP')
  }
  return data;
}
export const registerApi = async (payload: {
  name:string;
  email:string;
  password:string;
  phone:string;
  confirmPassword:string;
  gender:string;
  dob:string;
  fcmToken:string;
}) =>{
  const response = await fetch(
        'https://luvo-api.testdev.in/v1/user/auth/register',
    {
      method:'POST',
      headers:{
        'accept': '*/*',
        'Content-Type':'application/json',
         Authorization: 'Basic bHV2bzpsdXZvQCQxMjM0NUA=',
      },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    if(!response.ok){
      throw new Error(data.message || 'Registration Failed');
    }
    return data;
};

export const homeApi = async(accessToken:string)=>{
  const response = await fetch (
    'https://luvo-api.testdev.in/v1/home',
  {
method:'GET',
headers:{
  'Content-Type': 'application/json',
   Authorization:`Bearer ${accessToken}`,
  },
 } 
);
const data = await response.json();
if (!response.ok){
  const error:any = new Error(data.message || 'Something went wrong.');
  error.statusCode = response.status;
  throw error;
  throw new Error(data.message || 'Failed to fetch home data')
}
return data;
}

export const getProfileById = async(
  id:string,
  accessToken:string,
)=>{
  const response = await fetch(
    `https://luvo-api.testdev.in/v1/ai-profile/user/${id}`,
    {
      method:'GET',
      headers:{
        Authorization:`Bearer ${accessToken}`,
      },
    }
  );
  // const text = await response.text();
  // console.log('Raw RES:', text);
  const data= await response.json();
  if(!response.ok){
    const error: any = new Error(data.message || 'Failed to fetch the profile');
    error.statusCode = response.status;
    throw error;
  }
  return data;
};

export const getGifts = async(accessToken:string)=>{
  const response = await fetch(
    'https://luvo-api.testdev.in/v1/gifts/list',
    {
      method:'GET',
      headers:{
        Authorization:`Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  if(!response.ok){
    throw new Error(data.message || 'Failed to fetch the gifts');
  }
  return data;
};

export const getPlanList = async(accessToken :string)=>{
  const response = await fetch(
    'https://luvo-api.testdev.in/v1/subscription-plan/user/list',
  {
    method:'GET',
    headers:{
      Authorization:`Bearer ${accessToken}`,
    },
  }
);
const data = await response.json();
if(!response.ok){
  throw new Error(data.message || 'Failed to fetch the Plans List');
}
return data;

};

export const getPlanDetail = async(id:string,accessToken:string)=>{
  const response = await fetch(
    `https://luvo-api.testdev.in/v1/subscription-plan/${id}`,
  {
    method:'GET',
    headers:{
      Authorization: `Bearer ${accessToken}`,
    },
  }
);
const data =await response.json();
if(!response.ok){
  throw new Error(data.message || 'Failed to fetch the plan detail');
}
return data;
};

export const getUserData = async(userId:string, accessToken:string)=>{
  const response = await fetch(
    `https://luvo-api.testdev.in/v1/user/${userId}`,
    {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  if(!response.ok){
    throw new Error(data.message || 'Failed to fetch the user data.');
  }
  return data;
};

export const getToneList = async(accessToken:string)=>{
  const response = await fetch (
    'https://luvo-api.testdev.in/v1/tone/user',
    {
      method:'GET',
      headers:{
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  if(!response.ok){
    throw new Error (data.message || 'Failed to fetch the tone list');
  }
  return data;
};






// const refreshTokenAPi = async(refreshToken:string)=>{
//   const response = await fetch(
//     'https://luvo-api.apikart.co/v1/user/auth/login',
//     {
//       method:'POST',
//       headers:{
//         'Content-Type':'application/json',
//     },
//     body: JSON.stringify({refreshToken}),
//     }
//   );
//   const data = await response.json();
//   if(!response.ok){
//     throw new Error ('Refresh Token expired');

//   }
//   return data;
// }

