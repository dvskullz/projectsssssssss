import React, { useState } from "react";
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { IMAGES } from '../../../Constants/images';
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Switch from "../../Components/ToggleSwtitch";

const Language = () => {
    const navigation = useNavigation<any>();
    const [isEnabled, setIsEnabled] = useState(false);
    return (
        <View style={{ flex: 1, backgroundColor: '#fffafb' }}>
            <View style={style.customHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={24}
                    />
                </TouchableOpacity>
                <Text style={style.headerTitle}>Language Setting</Text>
                <View style={{ width: 4 }} />
            </View>
            <View style={style.headerSeperator} />


            <View style={style.switchRow}>
                <Text style={style.LangText}>English </Text>
                <Switch
                    value={isEnabled}
                    onValueChange={setIsEnabled}
                />

            </View>
        </View>
    )
};

const style = StyleSheet.create({
    text: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        top: 400,
        textAlign: 'center'
    },
    customHeader: {
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#fffafb'
    },
    headerTitle: {
        fontSize: 17,
        padding: 18,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium'
    },
    headerSeperator: {
        height: 1,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: '#f1f1f1',
        marginTop: -5,
    },
    switchRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:20,
        marginHorizontal:12
    },
    LangText:{
        fontFamily:'Poppins-Regular',
        fontSize:18
    }
});

export default Language;