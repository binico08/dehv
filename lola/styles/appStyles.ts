import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // 🏠 General Container
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    padding: 20,
  },

  // 🔴 Headers & Titles
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#D32F2F",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B71C1C",
    marginBottom: 10,
    textAlign: "center",
  },

  // 💊 Medication List Box
  medicationBox: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  medItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  medText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    color: "#333",
  },
  noMedsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#D32F2F",
    alignItems: "center",
    justifyContent: "center",
  },

  // ✏️ Improved Input Field Styling
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },

  // 📅 Date & Time Picker
  dateTimeInput: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },

  // 📌 Buttons with Spacing
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D32F2F",
    paddingVertical: 15,
    width: "90%",
    borderRadius: 12,
    marginBottom: 15, // Added spacing
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B71C1C",
    paddingVertical: 15,
    width: "90%",
    borderRadius: 12,
    marginBottom: 15, // Added spacing
  },
  safeButton: {
    backgroundColor: "#388E3C",
    padding: 15,
    borderRadius: 10,
    width: 220,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15, // Added spacing
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  addMedicationButton: {
    backgroundColor: "#D32F2F",
    width: "90%",
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
  },

  // 📌 Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    width: "85%",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#777",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  
  // ⏳ Emergency Countdown Timer
  countdownTimer: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#FF0000",
    textAlign: "center",
    alignSelf: "center",
    marginVertical: 30,
  },

  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },

  callingText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#D32F2F",
    textAlign: "center",
    alignSelf: "center",
  },

  ellipsisText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D32F2F",
    textAlign: "center",
    alignSelf: "center",
  },

  centeredText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D32F2F",
    textAlign: "center",
    alignSelf: "center",
    width: "100%",
  },
});

export default styles;
