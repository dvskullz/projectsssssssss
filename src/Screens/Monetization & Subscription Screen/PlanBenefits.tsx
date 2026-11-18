import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const PlanBenefits = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { plan } = route.params;

  const price = plan?.durations?.[0]?.price ?? 0;
  // console.log(plan);

  return (
    <View style={style.container}>
      
      <View style={style.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={style.headerTitle}>Plan Benefits</Text>
        <View style={{ width: 4 }} />
      </View>
      
      <View style={style.card}>
        {plan?.isPopular && (
          <View style={style.mostPopular}>
            <Text style={style.mostPopularText}>Most Popular</Text>
          </View>
        )}
        <Text style={style.price}>
          ₹{price}
          {price !== 0 && <Text style={style.per}>/Month</Text>}
        </Text>
        <Text style={style.planTitle}>{plan?.name}</Text>
      </View>

      <FlatList
        data={plan?.features}
        keyExtractor={(item,index)=> index.toString()}
        contentContainerStyle={style.featuresContainer}
        renderItem={({item})=>(
          <View style={style.featureRow}>
            <View style={style.bullet}/>
            <Text style={style.benefit}>{item}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={style.button}>
        <Text style={style.buttonText}>Upgrade Now</Text>
      </TouchableOpacity>
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
  planTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    // paddingTop:8,
    color: '#fff',
    textAlign: 'center',
  },
  price: {
    fontSize: 22,
    // marginVertical: 5,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    color: '#fff',
  },
  per: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
  },
  headerTitle: {
    fontSize: 17,
    padding: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  container: {
    flex: 1,
    backgroundColor: '#fffafb',
  },
  mostPopular: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#ffaa2b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 5,
  },
  mostPopularText: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  card: {
    padding: 20,
    borderWidth: 2,
    marginBottom: 20,
    borderRadius: 11,
    position: 'relative',
    borderColor: 'transparent',
    backgroundColor: '#dc143c',
    width:'90%',
    // height:'80%',
    alignSelf:'center',
    marginVertical:20,
    // paddingBottom:40
    // marginBottom:40
  },
  featuresContainer: {
    width: '90%',
    alignSelf: 'center',
    // paddingBottom:
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    // marginRight:10
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
   benefit: {
    fontSize: 15,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
   button: {
    // marginTop: 1,
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    marginBottom:20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});
export default PlanBenefits;
