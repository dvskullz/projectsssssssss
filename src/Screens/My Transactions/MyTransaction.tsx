import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { getPlanList } from '../../API/auth';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { normalize } from '../../../Constants/Normalize';

const MyTransaction = () => {
  const [activePlan, setActivePlan] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  // const user = useSelector((state:RootState)=>state.auth.user);

  // const id = user?.id;

  useEffect(() => {
    if (accessToken) {
      fetchPlan();
    }
  }, [accessToken]);

  const fetchPlan = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const res = await getPlanList(accessToken);
      setActivePlan(res?.data?.activeSubscription);
    } catch (err) {
      console.log('Failed to fetch the active Plan', err);
    } finally {
      setLoading(false);
    }
  };

  console.log(activePlan);

  const renderItem =({item}:any)=>{
      const isCancelled = item?.status === 'canceled' || item?.status === 'cancelled';
      const isExpire = item?.status ==='expired';

      return(
          <View style={style.singlePhotoCard}>
              <View style={style.row}>
                  <View>
                      <Text>
                          {item?.status == 'in_grace' ? 'In Grace' : item?.status}
                      </Text>
                  </View>
                  {item?.plancode}

              </View>
          </View>
      )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fffafb' }}>
      <View style={style.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={'#000'} />
        </TouchableOpacity>
        <Text style={style.headerTitle}>My Transactions</Text>
        <View style={{ width: 4 }} />
      </View>
      <View style={style.singlePhotoCard}>
       
        <View style={style.row}>

        {activePlan?.status && (
            <View style={style.current}>
            <Text style={style.currentText}>{activePlan?.status}</Text>
          </View>
        )}
        </View>

        <View style={style.box}>
          <Text style={style.planName}>{activePlan?.planSnapshot?.name}</Text>

          <Text style={style.desc}>
            {activePlan?.planSnapshot?.description}
          </Text>
          <Text style={style.order}>
            Order ID: <Text style={style.orderId}>{activePlan?.orderId}</Text>
          </Text>
          <Text style={style.amount}>₹ {activePlan?.amount}</Text>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  customHeader: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fffafb',
  },
  headerTitle: {
    fontSize: 17,
    padding: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  singlePhotoCard: {
    //         borderWidth: 1,
    //     marginBottom: 15,
    //     borderRadius: 10,
    //     overflow: 'hidden',
    //     backgroundColor: '#fff',
    //     borderColor: 'rgba(220, 20, 60, 1)',
    //     width:'95%',
    //     alignSelf:'center',
        // paddingVertical:10,
    //    marginTop:5,
        paddingHorizontal:5,
        // padding:15,
    // backgroundColor: '#ffccd6'
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderColor: 'rgba(220, 20, 60, 1)',
    width:'95%',
    alignSelf:'center'
  },
  desc: {
    fontSize: normalize(12),
    color: '#2f2f2f',
    fontFamily: 'Poppins-Medium',
  },
  box: {
    // paddingVertical: 10,
    paddingHorizontal: 8,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planName: {
    fontSize: normalize(15),
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  order: {
    fontSize: normalize(12),
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  orderId: {
    fontFamily: 'Poppins-Regular',
    color: '#555',
  },
  amount: {
    fontSize: normalize(21),
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  current: {
    top: 0,
    marginLeft:-5,
    // alignItems:'flex-start',
    borderTopLeftRadius: 9,
    borderBottomRightRadius: 10,
    backgroundColor: '#dc143c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    // borderRadius:6,
    //
    // top: 0,
    //     paddingVertical: 5,
    //     paddingHorizontal: 10,
    //     borderTopLeftRadius: 9,
    //     borderBottomRightRadius: 10,
    //     backgroundColor: '#dc143c',
  },
  currentText: {
    color: '#fff',
    fontSize: normalize(12),
    textTransform: 'capitalize',
    fontFamily: 'Poppins-Medium',
  },
});

export default MyTransaction;
