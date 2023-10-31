import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";
import { Controller, useForm } from "react-hook-form";

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import BackgroundImg from '@assets/logoPartyPlanner_preview_rev_1.png';

import { useAuth } from "@hooks/useAuth";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
}

export function SignIn() {

  const [isLoading, setIsLoading] = useState(false);

  const {signIn} = useAuth();
  const toast = useToast();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const {control, handleSubmit, formState: {errors}} = useForm<FormData>();

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  async function handleSignIn({email, password}: FormData) {
    try{
      setIsLoading(true);
      await signIn(email, password);

    }catch(error){
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'
      
      setIsLoading(false);

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <VStack flex={1} px={10} pb={16}>
      
        <Center my={24}>
          {/* <LogoSvg /> */}
          <Text color="gray.100" fontSize="lg" fontFamily="heading">
            Planeje sua festa com alguns cliques e sem complicações!
          </Text>

          <Image 
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          marginTop="10"
          width="100"
        />

          
        </Center>

        <Center marginTop="0">
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Acesse a conta
          </Heading>

          <Controller
            control={control}
            name="email"
            rules={{required: 'Informe o email'}}
            render={({ field: {onChange} }) => (
              <Input 
              placeholder="E-mail" 
              keyboardType="email-address"
              onChangeText={onChange}
              errorMessage={errors.email?.message}
              autoCapitalize="none"

            />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{required: 'Informe a senha'}}
            render={({ field: {onChange} }) => (
              <Input 
                placeholder="Senha" 
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                secureTextEntry
            />
            )}
          />    

          <Button title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
           />
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <Button 
            title="Criar Conta" 
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}