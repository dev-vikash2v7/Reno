import React from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import {  width } from '../../constants';

import { Skeleton } from 'moti/skeleton';



const ShowSkeleton = ({instantEat} :{instantEat : boolean}) => {

  const SkeletonCommonProps = {
    colorMode: 'light',
    transition: {
      type: 'timing',
      duration: 1500,
    },
    backgroundColor: '#D4D4D4',
  } as const;

  return (
    <View style={{ flex: 1 }}>

            <Skeleton
              height={(width * 9) / 16}
              width={width}
              show {...SkeletonCommonProps} />
            <View
              style={{
                margin: 10,
                width: width,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{ width: '75%' }}>
                <Skeleton
                  height={30}
                  width={150}
                  show {...SkeletonCommonProps}
                />
                <View style={{ marginTop: 10 }}>
                  <Skeleton
                    height={20}
                    width={70}
                    show {...SkeletonCommonProps}
                  />
                </ View>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '25%',
                }}>
                <Skeleton show {...SkeletonCommonProps} height={50} width={50} />
              </View>

              {/* <View style={{ margin: 10, marginTop: 15 }}>
                <Skeleton />
              </View> */}
            </View>





            
            <View style={{ margin: 15 }}>
              {
                !instantEat ? <>
                  <Skeleton height={25} width={80} show {...SkeletonCommonProps} />
                  <FlatList
                    style={{
                      marginTop: 10
                    }}
                    horizontal
                    data={[1, 2, 3, 4]}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{ marginLeft: !index ? 0 : 10 }}>
                          <Skeleton
                            height={55}
                            width={80}
                            show
                            {...SkeletonCommonProps} />
                        </View>
                      )
                    }}
                  />
                </> : <></>
              }









              {
                !instantEat ? <View style={{ marginTop: 30 }}>
                  <Skeleton height={25} width={80} show {...SkeletonCommonProps} />
                  <FlatList
                    style={{
                      marginTop: 15
                    }}
                    horizontal
                    data={[1, 2, 3, 4]}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{ marginLeft: !index ? 0 : 10 }}>
                          <Skeleton
                            height={55}
                            width={55}
                            show
                            {...SkeletonCommonProps} />
                        </View>
                      )
                    }}
                  />
                </View> : <></>
              }



              <View style={{ marginTop: 15, marginLeft: 0 }}>
                <Skeleton
                  height={25}
                  width={130}
                  show
                  {...SkeletonCommonProps} />
                <FlatList
                  style={{
                    marginTop: 15
                  }}
                  horizontal
                  data={[1, 2, 3, 4, 5, 6]}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ marginLeft: !index ? 0 : 10 }}>
                        <Skeleton
                          height={50}
                          width={50}
                          show
                          {...SkeletonCommonProps} />
                      </View>
                    )
                  }}
                />
              </View>
              <View style={{
                marginTop: 15,
                margin: 10
              }}>
                <Skeleton
                  height={25}
                  width={125}
                  show
                  {...SkeletonCommonProps} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginTop: 10,
                    width: '100%'
                  }}
                >
                  <View style={{ justifyContent: "center", marginRight: 10 }}>
                    <Skeleton show {...SkeletonCommonProps} width={70} height={20} />
                    <View style={{ marginTop: 5 }}>
                      <Skeleton
                        show {...SkeletonCommonProps}
                        width={width * 0.43}
                        height={40}
                      />
                    </View>
                  </View>
                  <View style={{ justifyContent: "center" }}>
                    <Skeleton show {...SkeletonCommonProps} width={100} height={20} />
                    <View style={{ marginTop: 5 }}>
                      <Skeleton
                        show {...SkeletonCommonProps}
                        width={width * 0.43}
                        height={40}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                height: 40,
                borderRadius: 20,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                borderWidth: 0.2,
                borderColor: '#707070',
                marginBottom: 10,
                marginHorizontal: 10,
                marginTop: 20
              }}>
                <Skeleton show {...SkeletonCommonProps}
                  radius={20}
                  height={40}
                  width={width - 50}
                />
              </View>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowOffset: { height: -3, width: 0 },
                height: 80,
                elevation: 15,
                alignItems: 'center',
                justifyContent: 'center',
                width: width,
              }}
            >
              <Skeleton show {...SkeletonCommonProps} width={'90%'} height={55} />
            </View>
          </View>



  )
}

export default ShowSkeleton