import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { BlurView } from "expo-blur";
import { Checkbox } from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, RectButton, ScrollView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { s } from "../../components/styles";

interface Word {
  foreign: string;
  current: string;
  id: string;
}

const Tab = createMaterialTopTabNavigator();

const saveWordBankArray = async (words: Word[]) => {
  try {
    await AsyncStorage.setItem("myWordBank", JSON.stringify(words));
    console.log("Loaded the wordbank array successfully");
  } catch (e) {
    console.error("Failed too save the wordbank array", e);
  }
};

const saveCollectionArray = async (coll: Word[]) => {
  try {
    await AsyncStorage.setItem("myCollectionArray", JSON.stringify(coll));
    console.log("Loaded the collections array successfully");
  } catch (e) {
    console.error("Failed too save the collections array", e);
  }
};

const loadWordBank = async (setWordBank: React.Dispatch<React.SetStateAction<Word[]>>) => {
  try {
    const jsonValueForBank = await AsyncStorage.getItem("myWordBank");
    if (jsonValueForBank !== null) {
      const savedWords: Word[] = JSON.parse(jsonValueForBank);
      setWordBank(savedWords);
    }
  } catch (e) {
    console.error("Failed to load word bank:", e);
  }
};

const loadCollection = async (setCategoryGroup: React.Dispatch<React.SetStateAction<Word[]>>) => {
  try {
    const jsonValueForCollection = await AsyncStorage.getItem("myCollectionArray");
    if (jsonValueForCollection !== null) {
      const savedCollection: Word[] = JSON.parse(jsonValueForCollection);
      setCategoryGroup(savedCollection);
    }
  } catch (e) {
    console.error("Failed to load collection array:", e);
  }
};

function WordBankTab({
  wordBank,
  renderRightActionForBank,
  renderLeftActionForBank,
  isButtonVisible,
  setButtonVisible,
  setPromptVisible,
}: any) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50, alignItems: "center" }}>
      <Text style={s.wordBankTextH2}>Hold Down a word to Edit.</Text>

      {isButtonVisible && (
        <View style={s.addToCollectionActionWrap}>
          <RectButton onPress={() => setPromptVisible(true)}>
            <Text style={s.wordBankTextH3}>Add vocab to collections</Text>
          </RectButton>
        </View>
      )}
      {wordBank.map((word: Word) => (
        <ReanimatedSwipeable
          key={word.id}
          rightThreshold={40}
          leftThreshold={40}
          renderRightActions={() => renderRightActionForBank(word)}
          renderLeftActions={() => renderLeftActionForBank(word)}
          containerStyle={s.swipeableContainer}
          onSwipeableOpen={(direction) => {
            if (direction === "right") {
              setButtonVisible(true);
            }
          }}
          onSwipeableClose={() => {
            setButtonVisible(false);
          }}
        >
          <View style={s.wordItemRow}>
            <Text style={s.wordItemLeft}>{word.foreign}</Text>
            <Text style={s.wordItemRight}>{word.current}</Text>
          </View>
        </ReanimatedSwipeable>
      ))}
    </ScrollView>
  );
}

function CollectionsTab({ categoryGroup, renderRightActionForCollections, renderLeftActionForCollections }: any) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={s.wordBankTextH2}>Your Collections</Text>
      {categoryGroup.map((word: Word) => (
        <ReanimatedSwipeable
          key={word.id}
          rightThreshold={40}
          leftThreshold={40}
          renderRightActions={() => renderRightActionForCollections(word)}
          renderLeftActions={() => renderLeftActionForCollections(word)}
          containerStyle={s.swipeableContainer}
        >
          <View key={word.current} style={[s.wordItemRow]}>
            <Text style={[s.wordItemLeft]}>{word.foreign}</Text>
            <Text style={[s.wordItemRight]}>{word.current}</Text>
          </View>
        </ReanimatedSwipeable>
      ))}
    </ScrollView>
  );
}

export default function Words() {
  const [foreignWord, setForeignWord] = useState("");
  const [currentLanguageWord, setCurrentLanguageWord] = useState("");
  const [categoryGroupName, setCategoryGroupName] = useState("");

  const [wordBank, setWordBank] = useState<Word[]>([]);
  const [categoryGroup, setCategoryGroup] = useState<Word[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState(false);
  const [isPromptVisible, setPromptVisible] = useState(false);

  const [isAlphabeticalSortForForeign, setAlphabeticalSortForForeign] = useState(false);
  const [isAlphabeticalSortForNative, setAlphabeticalSortForNative] = useState(false);

  useEffect(() => {
    loadWordBank(setWordBank);
  }, []);

  useEffect(() => {
    loadCollection(setCategoryGroup);
  }, []);

  useEffect(() => {
    saveWordBankArray(wordBank);
    saveCollectionArray(categoryGroup);
  }, [wordBank, categoryGroup]);

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
        id: Date.now().toString(),
      };
      setWordBank((prevWordBank) => [...prevWordBank, newWord]);
      setForeignWord("");
      setCurrentLanguageWord("");
    }
  };

  const addWordToCategoryGroup = (wordToAdd: Word) => {
    const theNameOfTheCollection = categoryGroupName.trim();
    const alreadyExists = categoryGroup.some((item) => item.id === wordToAdd.id);
    if (!alreadyExists) {
      // setCategoryGroup((prevCollectionArray) => [...prevCollectionArray, wordToAdd]);
    } else {
      Alert.alert("Word already in collections!");
    }
  };

  const deleteSingleWord = (idToDelete: string) => {
    setWordBank((prev) => prev.filter((word) => word.id !== idToDelete));
  };

  const deleteSingleWordFromCollectionArray = (idToDelete: string) => {
    setCategoryGroup((prev) => prev.filter((word) => word.id !== idToDelete));
  };

  const deleteAllWordInBank = () => {
    if (wordBank.length > 0) setWordBank([]);
    else Alert.alert("Word-Bank is empty.");
  };

  //should just and only delete the word that u swiped on when pressing the delete button that shows up
  const renderRightActionForBank = (word: Word) => {
    return (
      <View style={s.rightActionsWrap}>
        <RectButton style={s.deleteAction} onPress={() => deleteSingleWord(word.id)}>
          <FontAwesome name="trash" size={20} color="#fff" />
        </RectButton>
      </View>
    );
  };

  //should just and only add words to collections (PROMPT users for confirmation before appending to collections)
  const renderLeftActionForBank = (word: Word) => {
    return (
      <View style={s.leftActionWrap}>
        <RectButton style={s.addAction} onPress={() => addWordToCategoryGroup(word)}>
          <FontAwesome name="square" size={20} color="#000" />
        </RectButton>
      </View>
    );
  };

  const renderRightActionForCollections = (word: Word) => {
    return (
      <View style={s.rightActionsWrap}>
        <RectButton style={s.deleteAction} onPress={() => deleteSingleWordFromCollectionArray(word.id)}>
          <FontAwesome name="trash" size={20} color="#fff" />
        </RectButton>
      </View>
    );
  };

  const renderLeftActionForCollections = (word: Word) => {
    return (
      <View style={s.leftActionWrap}>
        <RectButton style={s.addAction}>
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
        style={s.container}
      >
        <TextInput
          style={[s.input, s.inputTop]}
          placeholder="Foreign Vocabulary"
          placeholderTextColor="#414141"
          value={foreignWord}
          onChangeText={setForeignWord}
        />

        <TextInput
          style={[s.input]}
          placeholder="Native Translation"
          placeholderTextColor="#414141"
          value={currentLanguageWord}
          onChangeText={setCurrentLanguageWord}
        />

        <View style={s.buttonPanel}>
          <FontAwesome name="plus" size={24} color="#414141" onPress={addWordToBank} />
          <FontAwesome name="filter" size={24} color="#414141" onPress={() => setIsModalVisible(true)} />
          <FontAwesome name="random" size={24} color="#414141" onPress={shuffleWordInBank} />
          <FontAwesome name="trash" size={24} color="#414141" onPress={deleteAllWordInBank} />
        </View>

        {setIsModalVisible && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
              setIsModalVisible(!isModalVisible);
            }}
          >
            <View style={s.centeredView}>
              <View style={s.modalView}>
                <Text style={s.Header}>Filter Panel</Text>
                <Text style={s.Text}>Choose which you would like to filter your vocabulary words by.</Text>

                <TouchableOpacity style={s.closeButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={s.textStyle}>Close</Text>
                </TouchableOpacity>

                <View style={s.section}>
                  <View style={s.textAndCheckbox}>
                    <Checkbox
                      style={s.checkbox}
                      value={isAlphabeticalSortForForeign}
                      onValueChange={() => {
                        setAlphabeticalSortForForeign(true);
                        setAlphabeticalSortForNative(false);
                      }}
                    />
                    <Text style={s.text}>Alphabetical Sort - Foreign Word</Text>
                  </View>

                  <View style={s.textAndCheckbox}>
                    <Checkbox
                      style={s.checkbox}
                      value={isAlphabeticalSortForNative}
                      onValueChange={() => {
                        setAlphabeticalSortForNative(true);
                        setAlphabeticalSortForForeign(false);
                      }}
                    />
                    <Text style={s.text}>Alphabetical Sort - Native Word</Text>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {setPromptVisible && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={isPromptVisible}
            onRequestClose={() => {
              setPromptVisible(!isPromptVisible);
            }}
          >
            <View style={s.centeredView}>
              <View style={s.modalView}>
                <Text style={s.Header}>Collections</Text>
                <Text style={s.Text}>Choose A Category Name for your word collections</Text>

                <TouchableOpacity style={s.closeButton} onPress={() => setPromptVisible(false)}>
                  <Text style={s.textStyle}>Nevermind...</Text>
                </TouchableOpacity>

                <TextInput
                  style={[s.input]}
                  placeholder="Native Translation"
                  placeholderTextColor="#414141"
                  value={categoryGroupName}
                  onChangeText={setCategoryGroupName}
                />
              </View>
            </View>
          </Modal>
        )}

        <BlurView intensity={50} tint="light" style={s.glassCard}>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: { backgroundColor: "#fff" },
              tabBarLabelStyle: { fontFamily: "ComfortaaBold", fontSize: 18, fontWeight: "bold", color: "#0e0e0eff" },
              tabBarIndicatorStyle: { backgroundColor: "#5ea898ff", height: 3 },
              sceneStyle: { backgroundColor: "transparent" },
            }}
          >
            <Tab.Screen name="Word Bank">
              {() => (
                <WordBankTab
                  wordBank={wordBank}
                  renderRightActionForBank={renderRightActionForBank}
                  renderLeftActionForBank={renderLeftActionForBank}
                  isButtonVisible={isButtonVisible}
                  setButtonVisible={setButtonVisible}
                  setPromptVisible={setPromptVisible}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="Collections">
              {() => (
                <CollectionsTab
                  categoryGroup={categoryGroup}
                  renderRightActionForCollections={renderRightActionForCollections}
                  renderLeftActionForCollections={renderLeftActionForCollections}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </BlurView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}
