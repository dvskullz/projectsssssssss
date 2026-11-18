import React, { useState,useEffect } from "react";
import {Text,View,StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { getPlanList } from "../../API/auth";
import { useDispatch,useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { useNavigation } from "@react-navigation/native";
import Arrow from '../../assets/images/arrow.svg';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Subscription = ()=>{
    const navigation = useNavigation<any>();
    const [plans,setPlans] = useState([]);
    const[loading,setLoading] = useState(false);
     const [selectedPlan, setSelectedPlan] = useState<any>(null);
    
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);


    const fetchPlans =async()=>{
        if(!accessToken) return null;
        try{
            setLoading(true);
            const res = await getPlanList(accessToken);
            setPlans(res?.data?.items || []);
        }catch(err){
            console.log('Plan API ERROR',err);
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchPlans();
    },[]);

    // console.log(plans)/
    const renderItem = ({item}) =>{
        const price = item?.durations?.[0]?.price;
        const planId = item?._id;
        
        return(
            <TouchableOpacity style={[
                style.singlePhotoCard,
             selectedPlan === planId && style.selectedCard,
            ]}
            onPress={() => setSelectedPlan(planId)}
             >
                {item?.isActiveForUser && (
                    <View style={style.currentBadge}>
                        <Text style={style.currentText}>Current Plan</Text>
                    </View>
                )}

                {item?.isPopular && (
                    <View style={style.mostPopular}>
                        <Text style={style.mostPopularText}>Most Popular</Text>
                    </View>
                )}
            <Text style={style.planTitle}>{item?.name}</Text>
                {/* <View style={style.planRow}> */}
                    {/* <View style={{flex:1}}> */}

                        <View style={style.priceRow}>
                          <Text style={style.price}>
                               ₹{price}
                              {price !== 0 && <Text style={style.per}>/Month</Text>}
                          </Text>
                          <TouchableOpacity onPress={()=>navigation.navigate('PlanBenefits',{plan:item})}>
                            <Arrow />
                          </TouchableOpacity>
                        </View>
                        <Text style={style.featureText}>{item?.description}</Text>
                    {/* </View> */}
                    
                {/* </View> */}
            </TouchableOpacity>
        )
    }

    return(
        <View style={style.container}>
            <View style={style.customHeader}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={'#000'}
                />
                </TouchableOpacity>
                <Text style={style.headerTitle}>Monetization & Subscriptions</Text>
                <View style={{width:4}}/>
            </View>

            <Text style={{textAlign:'center', color:'#dc143c', fontFamily:'Poppins-Bold', fontSize:14}}>Choose Your Plan </Text>

      <FlatList
        data={plans}
        keyExtractor={(item)=> item._id}
        renderItem={renderItem}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1,
    marginTop: 15,
    // paddingBottom: 40,
    paddingHorizontal: 15,}}
        />
        <TouchableOpacity style={style.button}>
                    <Text style={style.buttonText}> Upgrade Now </Text>
                  </TouchableOpacity>
        </View>
    );
};

const style = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'#fffafb'
},
      singlePhotoCard: {
        padding: 18,
        borderWidth: 2,
        marginBottom: 22,
        borderRadius: 11,
        position: "relative",
        borderColor: 'transparent',
        backgroundColor: '#ffccd6'
      },
      mostPopular:{
    position:'absolute',
    top:-12,
    right:20,
    backgroundColor:'#FFAA2B',
    paddingHorizontal:12,
    paddingVertical:4,
    borderRadius:20,
    zIndex:5
  },
  mostPopularText:{
    fontSize:12,
    color:'#000',
    fontFamily:'Poppins-SemiBold'
  },
   planTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    // marginBottom: 5,
    paddingTop:8
  },
  planRow:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  price: {
    fontSize: 22,
    marginVertical: 5,
    fontFamily: 'Poppins-Bold',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent:'space-between'
  },
  priceArrow: {
    marginLeft: 'auto',
    alignSelf: 'flex-end',
  },
  per: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  featureText: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
  },
  customHeader:{
    height:65,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingHorizontal:15,
    backgroundColor:'#fffafb'
  },
  headerTitle:{
    fontSize:17,
    padding:18,
    textAlign:'center',
    fontFamily:'Poppins-Medium'
  },
  currentBadge:{
    position:'absolute',
    top:-1,
    left:-1,
    backgroundColor:'#dc143c',
    paddingHorizontal:10,
    paddingVertical:4,
    borderRadius:6,
    // marginBottom:4
    
  },
  currentText:{
       fontSize:12,
    color:'#fff',
    fontFamily:'Poppins-SemiBold'
  },
  button: {
    // marginTop: 1,
    backgroundColor: '#DC143C',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    // marginBottom:-10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
   selectedCard: {
    borderWidth: 2,
    borderColor: '#dc143c',
  },
})

export default Subscription;
