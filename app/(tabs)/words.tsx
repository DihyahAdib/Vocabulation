import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

interface Word {
  foreign: string;
  current: string;
}

export const saveWordBank = async (words: object) => {
  try {
    const jsonValue = JSON.stringify(words);
    await AsyncStorage.setItem("myWordBank", jsonValue);
    console.log("Word bank save successfully!");
  } catch (e) {
    console.error("Failed to save word bank", e);
  }
};

export const loadWordBank = async (setWordBank: React.Dispatch<React.SetStateAction<Word[]>>) => {
  try {
    const jsonValue = await AsyncStorage.getItem("myWordBank");
    if (jsonValue !== null) {
      const savedWords: Word[] = JSON.parse(jsonValue);
      setWordBank(savedWords);
    }
  } catch (e) {
    console.error("Failed to load word bank:", e);
  }
};

export default function Words() {
  const [foreignWord, setForeignWord] = React.useState("");
  const [currentLanguageWord, setCurrentLanguageWord] = React.useState("");
  const [wordBank, setWordBank] = React.useState<Word[]>([]);

  React.useEffect(() => {
    loadWordBank(setWordBank);
  }, []);

  React.useEffect(() => {
    saveWordBank(wordBank);
  }, [wordBank]);

  const addWordToBank = () => {
    const foreignInputWord = foreignWord.trim();
    const currentInputWord = currentLanguageWord.trim();

    if (foreignInputWord === "" && currentInputWord === "") {
      Alert.alert("You havent inputted any words yet!");
      return;
    }

    if (foreignInputWord === currentInputWord) {
      Alert.alert("Foreign word is the same as the  word!");
      return;
    }

    if (foreignInputWord !== "" && currentInputWord !== "") {
      const newWord: Word = {
        foreign: foreignWord,
        current: currentLanguageWord,
      };
      setWordBank((prevWordBank) => [...prevWordBank, newWord]);
      setForeignWord("");
      setCurrentLanguageWord("");
    }
  };

  const deleteWord = () => {
    if (wordBank.length > 0) {
      const newWordBank = wordBank.slice(0, -1); //get entire array
      setWordBank(newWordBank);
    }
  };

  const shuffleWordInBank = () => {};
  return (
    <LinearGradient
      colors={["#5ea86dff", "#4e957eff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TextInput
        style={[InpStyles.input, InpStyles.inputTop, { fontFamily: "Comfortaa", fontSize: 18 }]}
        placeholder="Foreign Vocabulary"
        placeholderTextColor="#414141"
        value={foreignWord}
        onChangeText={setForeignWord}
      />

      <TextInput
        style={[InpStyles.input, { fontFamily: "Comfortaa", fontSize: 18 }]}
        placeholder="Native Translation"
        placeholderTextColor="#414141"
        value={currentLanguageWord}
        onChangeText={setCurrentLanguageWord}
      />

      <View style={styles.buttonPanel}>
        <FontAwesome name="plus" size={24} color="#414141" onPress={addWordToBank} />
        <FontAwesome name="random" size={24} color="#414141" onPress={shuffleWordInBank} />
      </View>

      <BlurView intensity={50} tint="light" style={styles.glassCard}>
        <Text style={styles.wordBankTextH1}>Word Bank</Text>
        <Text style={styles.wordBankTextH2}>Clicking A Word Item word will remove it.</Text>
        {wordBank.map((word) => (
          <View key={word.current} style={styles.wordItemRow}>
            <Text style={styles.wordItemLeft} onPress={deleteWord}>
              {word.foreign}
            </Text>
            <Text style={styles.wordItemRight} onPress={deleteWord}>
              {word.current}
            </Text>
          </View>
        ))}
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wordBankTextH1: {
    fontSize: 20,
    fontWeight: "700",
    paddingTop: 15,
    color: "#fff",
  },
  wordBankTextH2: {
    fontSize: 16,
    fontWeight: "600",
    paddingTop: 10,
    paddingBottom: 10,
    color: "#fff",
  },
  wordListContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  wordItemRow: {
    width: "88%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#bababa54",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  wordItemLeft: {
    color: "#414141ff",
    fontWeight: "600",
    fontSize: 18,
    flex: 1,
    textAlign: "left",
    paddingRight: 10,
  },
  wordItemRight: {
    color: "#414141ff",
    fontWeight: "600",
    fontSize: 18,
    flex: 1,
    textAlign: "right",
    paddingLeft: 10,
  },
  glassCard: {
    width: "90%",
    height: "73%",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  buttonPanel: {
    height: 50,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#bababa54",
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginTop: 10,
  },
});

const InpStyles = StyleSheet.create({
  input: {
    height: 45,
    width: "90%",
    marginTop: 5,
    padding: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#bababa54",
    fontSize: 16,
    color: "#414141",
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  inputTop: {
    marginTop: "10%",
  },
});
