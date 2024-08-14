import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, Platform, StatusBar, Dimensions, FlatList } from 'react-native';
import _ from 'lodash';
import { Skeleton } from 'moti/skeleton';

import { hp, wp } from 'src/app/Login';

const SkeletonCommonProps = {
    colorMode: 'light',
    transition: {
      type: 'timing',
      duration: 1500,
    },
    backgroundColor: '#D4D4D4',
  } as const;


const LoadingSkeleton = () => {
  return (
        <View style={{ flex: 1, marginTop: hp('4.4%') ,justifyContent: 'center', alignItems: 'center' }}>
          <View
          >
            <Skeleton height={55} width={wp('92%')} {...SkeletonCommonProps} show />
          </View>
          <View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={[1, 2, 3]}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      backgroundColor: '#fff',
                      shadowColor: '#00000029',
                      elevation: 7,
                      // shadowColor: '#000',
                      shadowOffset: { width: 0, height: 5 },
                      // shadowOpacity: 0.5,
                      shadowRadius: 2,
                      shadowOpacity: 0.2,
                      marginTop: 15,
                      marginHorizontal: 10,
                    }}>
                    {/* <Skeleton {...SkeletonCommonProps} show /> */}
                    <View
                      style={{
                        margin: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Skeleton height={25} width={150} {...SkeletonCommonProps} show />
                      <Skeleton height={22} width={50} {...SkeletonCommonProps} show />
                    </View>
                    <View
                      style={{
                        marginLeft: 15,
                        marginRight: 15,
                        marginBottom: 15,
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{ height: 110, width: 110, borderRadius: 10 }}
                      >
                        <Skeleton height={110} width={110}  {...SkeletonCommonProps} show />
                      </View>
                      <View style={{
                        marginLeft: 15, marginTop: 5, height: 70,
                        justifyContent: 'space-around'
                      }}>
                        <Skeleton height={30} width={60} {...SkeletonCommonProps} show />
                        <Skeleton height={15} width={60} {...SkeletonCommonProps} show />
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Skeleton height={18} width={100} {...SkeletonCommonProps} show />
                          <View
                            style={{
                              backgroundColor: '#fff',
                              marginLeft: 15,
                              borderRadius: 5,
                              paddingHorizontal: 10,
                            }}>
                            <Skeleton height={22} width={40} {...SkeletonCommonProps} show />
                          </View>
                        </View>
                      </View>

                    </View>
                    <View
                      style={{
                        width: '95%',
                        alignSelf: 'center',
                        marginBottom: 15,
                      }}>
                      <Skeleton height={20} width={150} {...SkeletonCommonProps} show />
                    </View>
                  </View>
                )
              }}
            />
          </View>
        </View>
  )
}

export default LoadingSkeleton