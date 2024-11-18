import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../config/supabase";

const Home = ({ navigation }) => {
  const [grupos, setGrupos] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchGrupos = async () => {
      const { data, error } = await supabase.from("grupo").select(`
        nome_grupo,
        avaliador:avaliador_id ( nome_avaliador ),
        alunos ( nome_aluno, curso )
      `);

      if (error) {
        setFetchError("Erro ao buscar grupos.");
        setGrupos([]);
        console.error("Supabase error:", error.message);
      } else {
        setGrupos(data);
        setFetchError(null);
      }
    };

    fetchGrupos();
  }, []);

  const toggleExpandGroup = (groupName) => {
    if (expandedGroups.includes(groupName)) {
      setExpandedGroups(expandedGroups.filter((name) => name !== groupName));
    } else {
      setExpandedGroups([...expandedGroups, groupName]);
    }
  };

  return (
    <View style={styles.container}>
      {fetchError && <Text style={styles.error}>{fetchError}</Text>}
      <Text style={styles.groupsTitle}>Grupos InovaWeek</Text>
      <FlatList
        data={grupos}
        keyExtractor={(item) => item.nome_grupo}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => toggleExpandGroup(item.nome_grupo)}
            >
              <Text style={styles.title}>{item.nome_grupo}</Text>
            </TouchableOpacity>
            {expandedGroups.includes(item.nome_grupo) && (
              <View style={styles.details}>
                <Text style={styles.subtitle}>
                  Avaliador: {item.avaliador?.nome_avaliador || "Não informado"}
                </Text>
                {item.alunos.length > 0 ? (
                  item.alunos.map((aluno, index) => (
                    <View key={index} style={styles.alunoCard}>
                      <Text>Nome: {aluno.nome_aluno}</Text>
                      <Text>Curso: {aluno.curso}</Text>
                    </View>
                  ))
                ) : (
                  <Text>Nenhum aluno neste grupo</Text>
                )}
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#323673",
  },
  listContainer: {
    paddingTop: 10,
  },
  card: {
    padding: 15,
    backgroundColor: "#F29727",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3B2F27",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 5,
  },
  details: {
    marginTop: 10,
  },
  alunoCard: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "#F2AB27",
    borderRadius: 5,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  groupsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});

export default Home;
