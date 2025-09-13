import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { BlurView } from "expo-blur";
import { Checkbox } from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Keyboard, Modal, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, Pressable, RectButton, ScrollView } from "react-native-gesture-handler";
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
  swipedWords,
  setSwipedWords,
  setPromptForCollectionCreationVisible,
  setSelectedWord,
  setEditForeign,
  setEditNative,
  setModalForEditingWordVisible,
}: any) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50, alignItems: "center" }}>
      <Text style={s.wordBankTextH2}>Hold Down a word to Edit.</Text>

      {swipedWords.length > 0 && (
        <View style={s.addToCollectionActionWrap}>
          <RectButton onPress={() => setPromptForCollectionCreationVisible(true)}>
            <Text style={s.wordBankTextH3}>Add {swipedWords.length} vocab(s) to collections</Text>
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
              setSwipedWords((prev: Word[]) => {
                if (!prev.find((w) => w.id === word.id)) {
                  return [...prev, word];
                }
                return prev;
              });
            }
          }}
          onSwipeableClose={() => {
            setSwipedWords((prev: Word[]) => prev.filter((w) => w.id !== word.id));
          }}
        >
          <Pressable
            key={word.id}
            onLongPress={() => {
              setSelectedWord(word);
              setEditForeign(word.foreign);
              setEditNative(word.current);
              setModalForEditingWordVisible(true);
            }}
            delayLongPress={200}
          >
            <View style={s.wordItemRow}>
              <Text style={s.wordItemLeft}>{word.foreign}</Text>
              <Text style={s.wordItemRight}>{word.current}</Text>
            </View>
          </Pressable>
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

function EditWordModal({
  isVisible,
  setModalForEditingWordVisible,
  selectedWord,
  setSelectedWord,
  editForeign,
  setEditForeign,
  editNative,
  setEditNative,
  setWordBank,
}: any) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow", (e) => {
      Animated.timing(slideAnim, {
        toValue: -e.endCoordinates.height / 2,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide", () => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [slideAnim]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setModalForEditingWordVisible(false)}
    >
      <View style={s.centeredView}>
        <Animated.View
          style={[
            s.modalView,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={s.Header}>Edit Word</Text>

          <Text style={s.Text}>Edit Vocabulary</Text>
          <TextInput
            style={s.editText}
            placeholder="Edit Vocabulary"
            placeholderTextColor="#414141"
            value={editForeign}
            onChangeText={setEditForeign}
          />

          <Text style={s.Text}>Edit Translation</Text>
          <TextInput
            style={s.editText}
            placeholder="Native Translation"
            placeholderTextColor="#414141"
            value={editNative}
            onChangeText={setEditNative}
          />

          <TouchableOpacity
            style={s.saveButton}
            onPress={() => {
              if (selectedWord) {
                setWordBank((prev: any) =>
                  prev.map((word: any) =>
                    word.id === selectedWord.id ? { ...word, foreign: editForeign, current: editNative } : word
                  )
                );
              }
              setModalForEditingWordVisible(false);
              setSelectedWord(null);
            }}
          >
            <Text style={s.textStyle}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.closeButton}
            onPress={() => {
              setModalForEditingWordVisible(false);
              setSelectedWord(null);
            }}
          >
            <Text style={s.textStyle}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function Words() {
  const [foreignWord, setForeignWord] = useState("");
  const [currentLanguageWord, setCurrentLanguageWord] = useState("");
  const [categoryGroupName, setCategoryGroupName] = useState("");

  const [wordBank, setWordBank] = useState<Word[]>([]);
  const [categoryGroup, setCategoryGroup] = useState<Word[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [swipedWords, setSwipedWords] = useState<Word[]>([]);

  const [isPromptForCollectionCreationVisible, setPromptForCollectionCreationVisible] = useState(false);
  const [isModalForEditingWordVisible, setModalForEditingWordVisible] = useState(false);

  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [editForeign, setEditForeign] = useState("");
  const [editNative, setEditNative] = useState("");

  //const [selectedForCollection, setSelectedForCollection] = useState<Word[]>([]);

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

  const addSwipedWordsToCategoryGroup = () => {
    console.log("did something 1");
    setCategoryGroup((prevCollectionArray) => {
      const newOnes = swipedWords.filter((word) => !prevCollectionArray.find((w) => w.id === word.id));
      console.log("did something 2");
      return [...prevCollectionArray, ...newOnes];
    });
    setSwipedWords([]);
    setPromptForCollectionCreationVisible(false);
  };

  // fix this one top one doesnt work
  const addWordToCategoryGroup = (wordToAdd: Word) => {
    const theNameOfTheCollection = categoryGroupName.trim();
    const alreadyExists = categoryGroup.some((item) => item.id === wordToAdd.id);
    if (!alreadyExists && !theNameOfTheCollection) {
      setCategoryGroup((prevCollectionArray) => [...prevCollectionArray, ...wordToAdd]);
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

  const renderRightActionForBank = (word: Word) => {
    return (
      <View style={s.rightActionsWrap}>
        <RectButton style={s.deleteAction} onPress={() => deleteSingleWord(word.id)}>
          <FontAwesome name="trash" size={20} color="#fff" />
        </RectButton>
      </View>
    );
  };

  const renderLeftActionForBank = (word: Word) => {
    return (
      <View style={s.leftActionWrap}>
        <RectButton style={s.addAction}>
          <FontAwesome name="check" size={20} color="#000" />
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
          <FontAwesome name="check" size={20} color="#000" />
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

        {/* Filter Modal */}
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

        {/* Collections Modal */}
        {setPromptForCollectionCreationVisible && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={isPromptForCollectionCreationVisible}
            onRequestClose={() => {
              setPromptForCollectionCreationVisible(!isPromptForCollectionCreationVisible);
            }}
          >
            <View style={s.centeredView}>
              <View style={s.modalView}>
                <Text style={s.Header}>Collections</Text>
                <Text style={s.Text}>Choose A Category Name for your word collections</Text>

                <TextInput
                  style={[s.input]}
                  placeholder="Category Name"
                  placeholderTextColor="#41414178"
                  value={categoryGroupName}
                  onChangeText={setCategoryGroupName}
                />

                <TouchableOpacity style={s.saveButton}>
                  <Text style={s.textStyle} onPress={addSwipedWordsToCategoryGroup}>
                    Save
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={s.closeButton} onPress={() => setPromptForCollectionCreationVisible(false)}>
                  <Text style={s.textStyle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Edit Word Modal */}
        <EditWordModal
          isVisible={isModalForEditingWordVisible}
          setModalForEditingWordVisible={setModalForEditingWordVisible}
          selectedWord={selectedWord}
          setSelectedWord={setSelectedWord}
          editForeign={editForeign}
          setEditForeign={setEditForeign}
          editNative={editNative}
          setEditNative={setEditNative}
          setWordBank={setWordBank}
        />

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
                  swipedWords={swipedWords}
                  setSwipedWords={setSwipedWords}
                  setPromptForCollectionCreationVisible={setPromptForCollectionCreationVisible}
                  setSelectedWord={setSelectedWord}
                  setEditForeign={setEditForeign}
                  setEditNative={setEditNative}
                  setModalForEditingWordVisible={setModalForEditingWordVisible}
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
