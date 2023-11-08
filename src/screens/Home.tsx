import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Heading, HStack, Text, VStack, useToast } from 'native-base';

import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { ExerciseCard } from '@components/ExerciseCard';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ServicesDTO } from '@dtos/ServicesDTO';
import { Loading } from '@components/Loading';

export function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [services, setServices] = useState<ServicesDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState('');

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenServiceDetails(serviceId: string) {
    navigation.navigate('exercise', {serviceId});
  }

  async function fetchGroups(){
    try{
      const response = await api.get('/groups');
      setGroups(response.data);

    }catch(error){
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os serviços.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    }
  }

  async function fetchServicesByGroup(){
    try{
      setIsLoading(true);

      const response = await api.get(`/services/bygroup/${groupSelected}`);
      setServices(response.data);

    }catch(error){
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os serviços.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(useCallback(() => {
    fetchServicesByGroup();
  }, [groupSelected]))

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList 
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group 
            name={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{
          px: 8,
        }}
        my={10}
        maxH={10}
      />

    { isLoading ? <Loading/> :

      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={2}>
          <Heading color="gray.200" fontSize="md" fontFamily="heading">
            Disponíveis
          </Heading>

          <Text color="gray.200" fontSize="sm">
            {services.length}
          </Text>
        </HStack>

        <FlatList 
          data={services}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ExerciseCard 
              onPress={() => handleOpenServiceDetails(item.id)} 
              data={item}
            />
            
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            paddingBottom: 20
          }}
        />

      </VStack>

    }

    </VStack>
  );
}