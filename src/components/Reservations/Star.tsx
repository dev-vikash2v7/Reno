import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';

interface Props {
    time: string;
 
}

class Star extends Component<Props> {
    render() {
        return (
            <View>
                <Ripple
                    rippleDuration={300}
                    style={{
                        width: 50,
                        height: 50,
                        marginLeft: 10,
                        marginTop: 20,
                        marginRight: 10,
                    }}
                   >
                    <View style={styles.twelvePointBurst}>
                        <View
                            style={[
                                styles.twelvePointBurstMain,
                                { backgroundColor: 'red' },
                            ]}
                        />
                       
                    </View>
                       
                </Ripple>
            </View>
        );
    }
}

const styles: any = {
    twelvePointBurst: {},
    twelvePointBurstMain: {
        width: 48,
        height: 48,
        borderRadius: 4,
        backgroundColor: '#d20000',
    },
    twelvePointBurst30: {
        width: 48,
        height: 48,
        borderRadius: 4,
        position: 'absolute',
        backgroundColor: '#d20000',
        top: 0,
        left: 0,
        transform: [{ rotate: '30deg' }],
    },
    twelvePointBurst60: {
        width: 48,
        height: 48,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: '#d20000',
        top: 0,
        left: 0,
        transform: [{ rotate: '60deg' }],
    },
};

export default Star;
