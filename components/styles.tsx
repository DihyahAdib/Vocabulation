// Preset sizes for user selection
import { StyleSheet } from "react-native";
export const wordItemSizes = StyleSheet.create({
  small: {
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: "80%",
  },
  medium: {
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: "89%",
  },
  large: {
    minHeight: 64,
    paddingVertical: 16,
    paddingHorizontal: 22,
    width: "98%",
  },
});

export const wordTextSizes = StyleSheet.create({
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 18,
  },
  large: {
    fontSize: 24,
  },
});

export const s = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  Header: {
    marginTop: 10,
    fontSize: 20,
    fontFamily: "ComfortaaBold",
  },

  Text: {
    marginTop: 10,
    alignSelf: "center",
    fontFamily: "Comfortaa",
    fontSize: 16,
  },

  saveButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
  },

  closeButton: {
    marginTop: 10,
    backgroundColor: "#f44336",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
  },

  textStyle: { color: "white", fontWeight: "bold", textAlign: "center", fontFamily: "Comfortaa" },

  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  section: { flexDirection: "column", alignItems: "flex-start" },
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
  wordBankTextH2: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Comfortaa",
    paddingTop: 10,
    paddingBottom: 10,
    color: "#ffffff92",
    textAlign: "center",
  },

  wordBankTextH3: {
    fontSize: 16,
    fontWeight: "900",
    fontFamily: "Comfortaa",
    paddingTop: 10,
    paddingBottom: 10,
    color: "#1c1c1cd8",
    textAlign: "center",
  },

  // Container for each swipeable row (controls row width and margin)
  swipeableContainer: {
    width: "89%", // easier to adjust overall row width here
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 12,
  },

  // Main row for word item (controls row height, padding, and border)
  wordItemRow: {
    width: "100%", // always fill swipeableContainer
    minHeight: 48, // set a minimum height for easier control
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "#bababa54",
    paddingVertical: 10,
    paddingHorizontal: 16,
    // To adjust row height, change minHeight or paddingVertical
  },

  // Text styles for left/right word columns
  wordItemLeft: {
    color: "#414141ff",
    fontWeight: "600",
    fontSize: 18,
    flex: 1,
    textAlign: "left",
    paddingRight: 8,
    fontFamily: "Comfortaa",
  },
  wordItemRight: {
    color: "#414141ff",
    fontWeight: "600",
    fontSize: 18,
    flex: 1,
    textAlign: "right",
    paddingLeft: 8,
    fontFamily: "Comfortaa",
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
    marginTop: 10,
  },

  addToCollectionActionWrap: {
    width: "80%",
    height: "15%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#bababa54",
    backgroundColor: "rgba(156, 86, 188, 1)",
    marginBottom: 10,
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
  textAndCheckbox: { flexDirection: "row", alignItems: "center" },
  checkbox: { margin: 8 },
  text: { fontSize: 15 },

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
  editText: {
    height: 40,
    width: "50%",
    margin: 0,
    padding: 0,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#bababa54",
    fontSize: 18,
    fontFamily: "Comfortaa",
    textAlign: "center",
    color: "#414141",
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
});
