import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Check from '../../assets/images/Check.svg';
import Arrow from '../../assets/images/arrow.svg';
import PlanModal from '../PlanDetail';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { getPlanList } from '../../API/auth';
import { useRoute } from '@react-navigation/native';
type Props = {
  visible: boolean;
  onClose: () => void;
  postData?: any;
};

const UnlockPhoto = ({ visible, onClose, postData }: Props) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const paywall =
    postData?.meta?.access?.paywall?.offers ||
    postData?.media?.[0]?.access?.paywall?.offers ||
    [];

  const photoPlans = paywall.filter((item: any) => item.type === 'PPV');
  const userPlans = paywall.find((item: any) => item.type === 'PLAN');

  // console.log('PostData',postData);
  // console.log('Photo',photoPlans);
  // console.log('user', userPlans);
  // if(!postData) return null;
  // const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showbenefits, setShowbenefits] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // useEffect(()=>{
  //   if(visible){
  //     fetchPlans();
  //   }
  // },[visible]);

  // const fetchPlans=async()=>{
  //   if(!accessToken) return;
  //   try{
  //     setLoading(true);
  //     const res = await getPlanList(accessToken);

  //     // setPlans(res?.data?.items);
  //     }catch(error){
  //       console.log('Plan API error',error);
  //     }finally{
  //       setLoading(false);
  //     }
  // };

  //  useEffect(() => {
  //     fetchData();
  //   }, []);

  //   const fetchData = async()=>{
  //   if(!accessToken) return null;
  //    try{
  //       setLoading(true);
  //       const res = await getPlanList(accessToken);

  //       setDetail(res?.data);
  //       }catch(error){
  //         console.log('Plan API error',error);
  //       }finally{
  //         setLoading(false);
  //       }
  // };

  // console.log('plan detail', detail);

  const thumbnail =
    postData?.media?.length > 0
      ? postData.media[0]?.thumbnail
      : postData?.mediaThumbnail;
  const selectedPlanKey = selectedPlan?._id ?? selectedPlan?.name ?? null;
  // console.log("postdata",postData);
  // console.log("paywall",paywall);
  // console.log("photoPlans",photoPlans);
  // console.log('userPlan', userPlans);
  return (
    <>
      <Modal transparent animationType="slide" visible={visible}>
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
              <Text style={style.title}>Unlock Photo</Text>
            </View>

            {loading ? (
              <ActivityIndicator size={'large'} color={'#dc143c'} />
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                style={{ marginTop: 5 }}
              >
                <ImageBackground
                  style={[style.planBox, { padding: 0, borderWidth: 0 }]}
                  source={{ uri: thumbnail }}
                  //  style={style.planBox}
                  imageStyle={{ borderRadius: 12 }}
                >
                  <View style={style.planOverlay}>
                    <Text style={style.planTitle}>Unlock Photo</Text>
                    <Text style={style.infoText}>
                      This Photo is blurred for privacy. Unlock to view the full
                      image and connect instantly.
                    </Text>
                  </View>
                </ImageBackground>
                {photoPlans?.length > 0 && (
                  <TouchableOpacity
                    style={[
                      style.singlePhotoCard,
                      selectedPlan === 'single' && style.selectedCard,
                    ]}
                    onPress={() => setSelectedPlan('single')}
                  >
                    <Text style={style.planTitle}>Single Photo Unlock</Text>
                    <View style={style.priceRow}>
                      <Text style={style.price}>
                        ₹{photoPlans[0]?.price}
                        <Text style={style.per}>/Photo</Text>
                      </Text>
                    </View>
                    <Text style={style.infoText}>
                      Unlock this photo instantly.
                    </Text>
                  </TouchableOpacity>
                )}
                {/* {plans.map((plan) =>{
                const price = plan?.durations?.[0]?.price || 0; */}
                {userPlans?.plans?.map((plan: any, index: number) => {
                  const price = plan?.durations?.[0]?.price || 0;
                  const planKey = `${
                    plan?._id ?? plan?.name ?? 'plan'
                  }-${index}`;
                  const currentPlanKey = plan?._id ?? plan?.name ?? null;
                  return (
                    <TouchableOpacity
                      key={planKey}
                      style={[
                        style.singlePhotoCard,
                        selectedPlanKey === currentPlanKey && style.selectedCard,
                      ]}
                      onPress={() => {
                        setSelectedPlan(plan);
                        // setShowbenefits(true);
                      }}
                    >
                      {plan.isPopular && (
                        <View style={style.mostPopular}>
                          <Text style={style.mostPopularText}>
                            Most Popular
                          </Text>
                        </View>
                      )}
                      <Text style={style.planTitle}>{plan.name}</Text>

                      <View style={style.priceRow}>
                        <Text style={style.price}>
                          ₹{price}
                          <Text style={style.per}>/Month</Text>
                        </Text>
                        <TouchableOpacity
                          // style={style.singlePhotoCard}
                          onPress={() => {
                            setSelectedPlan(plan);
                            setShowbenefits(true);
                          }}
                        >
                          <Arrow width={20} height={22} />
                        </TouchableOpacity>
                      </View>

                      <Text style={style.infoText}>{plan.description}</Text>
                    </TouchableOpacity>
                  );
                })}

                {/* <TouchableOpacity
              onPress={() => setSelectedPlan('single')}
              style={[
                style.singlePhotoCard,
                selectedPlan === 'single' && style.selectedCard,
              ]}
            >
              <View> */}
                {/* 
                <Text style={style.price}>
                  ₹99 <Text style={style.per}>/Photo</Text>
                </Text>
              </View>
              <Text style={style.infoText}>Unlock this Photo instantly.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedPlan('girl');
            }}
              style={[
                style.singlePhotoCard, */}
                {/* selectedPlan === 'girl' && style.selectedCard,
              ]}
            >
              <View>
                <Text style={style.planTitle}>Girl Friend Plan</Text>
               
                  <TouchableOpacity onPress={()=>{
                    setSelectedPlan('girl');
                    setShowbenefits(true);
                    }}>
                  </TouchableOpacity>
                {/* </View> */}

                {/* </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedPlan('close')}
              style={[
                style.singlePhotoCard,
                selectedPlan === 'close' && style.selectedCard,
              ]}
            >
                */}
                {/* <View>
                <Text style={style.planTitle}>Close Friend Plan </Text>
                 <View style={style.priceRow}>
                <Text style={style.price}>
                  ₹999 <Text style={style.per}>/Month</Text>
                </Text>
                <TouchableOpacity onPress={()=>{
                    setSelectedPlan('close')
                    setShowbenefits(true);
                    
                    }}>
                    <Arrow width={20} height={22} />
                  </TouchableOpacity>
                </View>
                <Text style={style.infoText}> */}
                {/* Experience unlimited chats and access to premium AI
                  influencers.
                </Text>
              </View>
            </TouchableOpacity> */}
                <View style={style.benefits}>
                  <Check style={style.check} />
                  <Text style={style.benefitText}>
                    {' '}
                    View full, clear photo.
                  </Text>
                </View>

                <View style={style.benefitsLast}>
                  <Check style={style.check} />
                  <Text style={style.benefitText}>
                    {' '}
                    Build trust & better connections.
                  </Text>
                </View>
              </ScrollView>
            )}
            <TouchableOpacity style={style.button}>
              <Text style={style.buttonText}> Upgrade Now </Text>
            </TouchableOpacity>
          </View>
        </View>
        <PlanModal
          visible={showbenefits}
          plan={selectedPlan}
          onClose={() => setShowbenefits(false)}
        />
      </Modal>
    </>
  );
};

const style = StyleSheet.create({
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#000000B2',
  },
  container: {
    backgroundColor: '#fffafb',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    // padding:18,
    flex: 1,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#f5f5f5eb',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  infoTitle: {
    fontFamily: 'Poppins-Bold',
    marginBottom: 5,
  },
  infoText: {
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  singlePhotoCard: {
    padding: 18,
    borderWidth: 2,
    marginBottom: 18,
    borderRadius: 11,
    position: 'relative',
    borderColor: 'transparent',
    backgroundColor: '#ffccd6',
    // marginHorizontal:-12,
    // borderWidth: 2,
    // borderColor: '#FFf',
    // backgroundColor: '#ffccd6',
    // borderRadius: 12,
    // marginBottom: 15,
    // padding: 15,
    // position:'relative'
    //  margin:10
  },
  planTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 22,
    marginVertical: 5,
    fontFamily: 'Poppins-Bold',
  },
  per: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
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
  benefits: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  benefitsLast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'flex-start',
    //   marginVertical:10``
  },
  check: {
    width: 15,
    // marginBottom:5
  },
  benefitText: {
    color: '#000',
    fontFamily: 'Poppins-Regular',

    // fontSize:12
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#dc143c',
  },
  //   planCard: {
  //     borderWidth: 1,
  //     borderColor: '#fff',
  //     padding: 16,
  //     marginBottom: 12,
  //     backgroundColor: '#fdeeee',
  //   },
  mostPopular: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#FFAA2B',
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
  planBox: {
    // height:140,
    padding: 18,
    borderWidth: 2,
    marginBottom: 18,
    borderRadius: 11,
    position: 'relative',
    borderColor: 'transparent',
    backgroundColor: '#ffccd6',
  },
  planOverlay: {
    padding: 18,
    width: '100%',
    backgroundColor: '#fff2f5b3',
  },
});

export default UnlockPhoto;
