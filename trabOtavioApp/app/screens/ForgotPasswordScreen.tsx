import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "../config/supabase";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setResetError("Erro ao enviar o email de recuperação: " + error.message);
      setResetSuccess(null);
    } else {
      setResetError(null);
      setResetSuccess("Email de recuperação enviado com sucesso!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      {resetError && <Text style={styles.error}>{resetError}</Text>}
      {resetSuccess && <Text style={styles.success}>{resetSuccess}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handlePasswordReset}
      >
        <View style={[styles.button, { padding: 15, borderRadius: 5 }]}>
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
          >
            Enviar email de recuperação
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate("Login")}
      >
        <View style={[styles.button, { padding: 15, borderRadius: 5 }]}>
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
          >
            Voltar ao Login
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#323673",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#F29727",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  success: {
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#5AA64E",
  },
});
