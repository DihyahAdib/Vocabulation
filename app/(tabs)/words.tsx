import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { Checkbox } from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { GestureHandlerRootView, RectButton } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

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
  const [foreignWord, setForeignWord] = useState("");
  const [currentLanguageWord, setCurrentLanguageWord] = useState("");
  const [wordBank, setWordBank] = useState<Word[]>([]);
  const [categoryGroup, setCategoryGroup] = useState<Word[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCollectionsPageVisible, setCollectionsPageVisible] = useState(false);
  const [isWordBankPageVisible, setWordBankPageVisible] = useState(false);
  const [isAlphabeticalSortForForeign, setAlphabeticalSortForForeign] = useState(false);
  const [isAlphabeticalSortForNative, setAlphabeticalSortForNative] = useState(false);

  useEffect(() => {
    loadWordBank(setWordBank);
  }, []);

  useEffect(() => {
    saveWordBank(wordBank);
  }, [wordBank]);

  useEffect(() => {
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

  const addWordToCategoryGroup = (indexToAdd: number) => {
    let prev: any = [];

    if (prev.filter(indexToAdd)) {
      setCategoryGroup((prev) => [...prev, ...categoryGroup]);
    }
  };

  const deleteSingleWord = (indexToDelete: number) => {
    setWordBank((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const deleteAllWordInBank = () => {
    const total = wordBank.length;
    if (total > 0) setWordBank(wordBank.slice(total, 1));
    else Alert.alert("Word-Bank is empty.");
  };

  const renderRightActions = (index: number) => {
    return (
      <View style={styles.rightActionsWrap}>
        <RectButton style={styles.deleteAction} onPress={() => deleteSingleWord(index)}>
          <FontAwesome name="trash" size={20} color="#fff" />
          {/* <Text style={styles.deleteActionText}>Delete</Text> */}
        </RectButton>
      </View>
    );
  };

  const renderLeftActions = (index: number) => {
    return (
      <View style={styles.leftActionWrap}>
        <RectButton style={styles.addAction} onPress={() => addWordToCategoryGroup(index)}>
          <FontAwesome name="square" size={20} color="#000" />
        </RectButton>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <FontAwesome name="trash" size={24} color="#414141" onPress={deleteAllWordInBank} />
        </View>

        <BlurView intensity={50} tint="light" style={styles.glassCard}>
          <View style={styles.titleContainer}>
            <Text style={styles.wordBankTextH1} onPress={() => setWordBankPageVisible}>
              Word Bank
            </Text>
            <Text style={styles.wordBankTextH1} onPress={() => setCollectionsPageVisible}>
              Collections
            </Text>
          </View>
          <Text style={styles.wordBankTextH2}>Swipe to delete.</Text>

          {setWordBankPageVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={isWordBankPageVisible}
              onRequestClose={() => {
                setWordBankPageVisible(!isWordBankPageVisible);
              }}
            ></Modal>
          )}
          {wordBank.map((word, index) => (
            <ReanimatedSwipeable
              key={`${word.current}-${index}`}
              rightThreshold={40}
              leftThreshold={40}
              renderRightActions={() => renderRightActions(index)}
              renderLeftActions={() => renderLeftActions(index)}
              containerStyle={styles.swipeableContainer}
            >
              <View key={word.current} style={styles.wordItemRow}>
                <Text style={styles.wordItemLeft}>{word.foreign}</Text>
                <Text style={styles.wordItemRight}>{word.current}</Text>
              </View>
            </ReanimatedSwipeable>
          ))}

          {setCollectionsPageVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={isCollectionsPageVisible}
              onRequestClose={() => {
                setCollectionsPageVisible(!isCollectionsPageVisible);
              }}
            >
              {categoryGroup.map((word, index, id) => (
                <ReanimatedSwipeable
                  key={`${word.current}-${index}-${id}`}
                  rightThreshold={40}
                  leftThreshold={40}
                  renderRightActions={() => renderRightActions(index)}
                  renderLeftActions={() => renderLeftActions(index)}
                  containerStyle={styles.swipeableContainer}
                >
                  <View key={word.current} style={styles.wordItemRow}>
                    <Text style={styles.wordItemLeft}>{word.foreign}</Text>
                    <Text style={styles.wordItemRight}>{word.current}</Text>
                  </View>
                </ReanimatedSwipeable>
              ))}
            </Modal>
          )}
        </BlurView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const Sort = StyleSheet.create({
  section: { flexDirection: "column", alignItems: "flex-start" },
  textAndCheckbox: { flexDirection: "row", alignItems: "center" },
  checkbox: { margin: 8 },
  text: { fontSize: 15 },
});

const modalStyles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  Header: { marginTop: 0, textAlign: "left", fontSize: 20, fontFamily: "ComfortaaBold" },
  Text: { marginTop: 15, marginBottom: 15, textAlign: "center", fontFamily: "Comfortaa" },
  closeButton: {
    top: 10,
    right: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    position: "absolute",
    backgroundColor: "#2196F3",
  },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center", fontFamily: "Comfortaa" },
});

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  titleContainer: {
    gap: "15%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightActionsWrap: {
    width: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  leftActionWrap: {
    width: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteAction: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e53935",
    borderRadius: 10,
  },
  addAction: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#75c6b0ff",
    borderRadius: 10,
  },
  deleteActionText: { color: "#fff", fontWeight: "700", marginTop: 6 },

  wordBankTextH1: { fontSize: 22, fontWeight: "700", fontFamily: "ComfortaaBold", paddingTop: 15, color: "#fff" },
  wordBankTextH2: { fontSize: 16, fontWeight: "600", paddingTop: 10, paddingBottom: 10, color: "#ffffffd6" },

  swipeableContainer: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 10,
  },

  wordItemRow: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#bababa54",
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  wordItemLeft: { color: "#414141ff", fontWeight: "600", fontSize: 18, flex: 1, textAlign: "left", paddingRight: 10 },
  wordItemRight: { color: "#414141ff", fontWeight: "600", fontSize: 18, flex: 1, textAlign: "right", paddingLeft: 10 },

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
  inputTop: { marginTop: "10%" },
});
