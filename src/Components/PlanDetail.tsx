import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
type Props = {
  visible: boolean;
  onClose: () => void;
  plan: any;
};

const PlanModal = ({ visible, onClose, plan }: Props) => {
    const price = plan?.durations?.[0]?.price || 0;

  return (

    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={style.overlay}>
        <View style={style.container}>
          <View style={style.header}>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#000"
              />
            </TouchableOpacity>
            <Text style={style.title}>Plan Benefits</Text>
          </View>
          <View style={style.planCard}>
            {plan?.isPopular && (
                <View style={style.mostPopular}>
                    <Text style={style.mostPopularText}>Most Popular</Text>
                    </View>
            )}
            <Text style={style.price}>
            ₹{price} <Text style={style.per}>/Month</Text>
            </Text>
            <Text style={style.plan}>{plan?.name}</Text>
          </View>
          {plan?.features?.map((item:string, index:number) => (
            <View key={index} style={style.benifitRow}>
                <View style={style.bullet}/>
            <Text key={index} style={style.benefit}>
                {item}
            </Text>
            </View>
          ))} 

          {/* <View style={style.benefits}>
            <View style={style.benifitRow}>
              <View style={style.bullet} />
              <Text style={style.benefit}>Full NSFW/uncensored toggle </Text>
            </View>
            <View style={style.benifitRow}>
              <View style={style.bullet} />
              <Text style={style.benefit}>Priority response </Text>
            </View>
            <View style={style.benifitRow}>
              <View style={style.bullet} />
              <Text style={style.benefit}>Voice replies/calls </Text>
            </View>
            <View style={style.benifitRow}>
              <View style={style.bullet} />
              <Text style={style.benefit}>
                Top-tier curated influencers (T1-T3)
              </Text>
            </View>
            <View style={style.benifitRow}>
              <View style={style.bullet} />
              <Text style={style.benefit}> Extended Free requests </Text>
            </View>
            <View style={style.benifitRow}>
              <View style={style.bullet} />
              <Text style={style.benefit}> Video calls </Text>
            </View>
          </View> */}

          <View style={style.buttonContainer}>
            <TouchableOpacity style={style.button}>
              <Text style={style.buttonText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000B2',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fffafb',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    height: '78%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    flex: 1,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#dc143c',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
  },
  per: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  plan: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  benefits: {
    marginTop: 10,
    // alignContent:'center',
    // alignItems:'center',
    // alignSelf:'center'
    marginLeft:5,
    marginBottom: 10
  },
  benefit: {
    fontSize: 15,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#dc143c',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  benifitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    textAlign:'center'
  },
  mostPopular:{
    position:'absolute',
    top:-12,
    // right:110,
    alignSelf:'center',
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
  }
});
export default PlanModal;
