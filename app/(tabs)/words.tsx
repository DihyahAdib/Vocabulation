import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { Checkbox } from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isAlphabeticalSortForForeign, setAlphabeticalSortForForeign] = React.useState(false);
  const [isAlphabeticalSortForNative, setAlphabeticalSortForNative] = React.useState(false);

  React.useEffect(() => {
    loadWordBank(setWordBank);
  }, []);

  React.useEffect(() => {
    saveWordBank(wordBank);
  }, [wordBank]);

  React.useEffect(() => {
    let sortedWords = [...wordBank];

    if (isAlphabeticalSortForForeign) {
      sortedWords.sort((a, b) => a.foreign.localeCompare(b.foreign));
    }

    if (isAlphabeticalSortForNative) {
      sortedWords.sort((a, b) => a.current.localeCompare(b.current));
    }

    const isDifferent = JSON.stringify(sortedWords) !== JSON.stringify(wordBank);
    if (isDifferent) {
      setWordBank(sortedWords);
    }
  }, [isAlphabeticalSortForForeign, isAlphabeticalSortForNative, wordBank]);

  const shuffleWordInBank = () => {
    let newArray = [...wordBank];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    setWordBank(newArray);
  };

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

  const deleteWord = (indexToDelete: number) => {
    setWordBank((prevWordBank) => prevWordBank.filter((_, index) => index !== indexToDelete));
  };

  const deleteWordInBank = () => {
    const totalWords = wordBank.length;
    if (totalWords > 0) {
      const newWordBank = wordBank.slice(totalWords, -1);
      setWordBank(newWordBank);
    }
  };

  return (
    <LinearGradient
      colors={["#5ea86dff", "#4e957eff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {setIsModalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(!isModalVisible);
          }}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <Text style={modalStyles.Header}>Filter Panel</Text>
              <Text style={modalStyles.Text}>Choose which you would like to filter your vocabulary words by.</Text>

              <TouchableOpacity style={modalStyles.closeButton} onPress={() => setIsModalVisible(false)}>
                <Text style={modalStyles.textStyle}>Close</Text>
              </TouchableOpacity>

              <View style={Sort.section}>
                <View style={Sort.textAndCheckbox}>
                  <Checkbox
                    style={Sort.checkbox}
                    value={isAlphabeticalSortForForeign}
                    onValueChange={() => {
                      setAlphabeticalSortForForeign(true);
                      setAlphabeticalSortForNative(false);
                    }}
                  />
                  <Text style={Sort.text}>Alphabetical Sort - Foreign Word</Text>
                </View>

                <View style={Sort.textAndCheckbox}>
                  <Checkbox
                    style={Sort.checkbox}
                    value={isAlphabeticalSortForNative}
                    onValueChange={() => {
                      setAlphabeticalSortForNative(true);
                      setAlphabeticalSortForForeign(false);
                    }}
                  />
                  <Text style={Sort.text}>Alphabetical Sort - Native Word</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <TextInput
        style={[InpStyles.input, InpStyles.inputTop]}
        placeholder="Foreign Vocabulary"
        placeholderTextColor="#414141"
        value={foreignWord}
        onChangeText={setForeignWord}
      />

      <TextInput
        style={[InpStyles.input]}
        placeholder="Native Translation"
        placeholderTextColor="#414141"
        value={currentLanguageWord}
        onChangeText={setCurrentLanguageWord}
      />

      <View style={styles.buttonPanel}>
        <FontAwesome name="plus" size={24} color="#414141" onPress={addWordToBank} />
        <FontAwesome name="filter" size={24} color="#414141" onPress={() => setIsModalVisible(true)} />
        <FontAwesome name="random" size={24} color="#414141" onPress={shuffleWordInBank} />
        <FontAwesome name="trash" size={24} color="#414141" onPress={deleteWordInBank} />
      </View>

      <BlurView intensity={50} tint="light" style={styles.glassCard}>
        <Text style={styles.wordBankTextH1}>Word Bank</Text>
        <Text style={styles.wordBankTextH2}>Press a word item to delete it.</Text>
        {wordBank.map((word, index) => (
          <View key={word.current} style={styles.wordItemRow}>
            <Text style={styles.wordItemLeft} onPress={() => deleteWord(index)}>
              {word.foreign}
            </Text>
            <Text style={styles.wordItemRight} onPress={() => deleteWord(index)}>
              {word.current}
            </Text>
          </View>
        ))}
      </BlurView>
    </LinearGradient>
  );
}

const Sort = StyleSheet.create({
  section: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  textAndCheckbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
  },
  text: {
    fontSize: 15,
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  Header: {
    marginTop: 0,
    textAlign: "left",
    fontSize: 20,
    fontFamily: "ComfortaaBold",
  },
  Text: {
    marginTop: 15,
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Comfortaa",
  },
  closeButton: {
    top: 10,
    right: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    position: "absolute",
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Comfortaa",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 20,
    backgroundColor: "red",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  wordBankTextH1: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "ComfortaaBold",
    paddingTop: 15,
    color: "#fff",
  },
  wordBankTextH2: {
    fontSize: 16,
    fontWeight: "600",
    paddingTop: 10,
    paddingBottom: 10,
    color: "#ffffffd6",
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
    fontSize: 18,
    fontFamily: "Comfortaa",
    color: "#414141",
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  inputTop: {
    marginTop: "10%",
  },
});
