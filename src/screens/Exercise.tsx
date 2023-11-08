import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Heading, HStack, Icon, Image, Text, useToast, VStack } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ServicesDTO } from '@dtos/ServicesDTO';

type RouteParamsProps ={
  serviceId: string;
}

export function Exercise() {

const [service, setService] = useState<ServicesDTO>({} as ServicesDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const toast = useToast();

  const { serviceId } = route.params as RouteParamsProps;

  async function fetchServicesDetails(){
    try{
      const response = await api.get(`/services/${serviceId}`);
      setService(response.data);

    }catch(error){
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar detalhes dos serviços';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    } 
  }

  useEffect(() => {
    fetchServicesDetails();
  }, [serviceId])

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon 
            as={Feather}
            name="arrow-left"
            color="green.500"
            size={6}
          />
        </TouchableOpacity>

        <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center">
          <Heading color="gray.100" fontSize="lg"  flexShrink={1} fontFamily="heading">
            {service.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="gray.200" ml={1} textTransform="capitalize">
              {service.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <VStack p={8}>
        <Image
          w="full"
          h={80}
          source={{ uri: `${api.defaults.baseURL}/photos/thumb/${service.thumb}` }}
          alt="Nome do exercício"
          mb={3}
          resizeMode="cover"
          rounded="lg"
        />

        <Box bg="gray.600" rounded="md" pb={4} px={4}>
          <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
            <HStack>
              <SeriesSvg />

              <Text color="gray.200" ml="2">
                3 séries
              </Text>
            </HStack>

            <HStack>
              <RepetitionsSvg />
              
              <Text color="gray.200" ml="2">
                12 repetições
              </Text>
            </HStack>
          </HStack>

          <Button 
            title="Marcar como realizado"
          />
        </Box>
      </VStack>
    </VStack>
  );
}