import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // EmergencyScreen Styles
  emergencyButton: {
    backgroundColor: "#D32F2F",
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    marginBottom: 15,
  },
  safeButton: {
    backgroundColor: "#388E3C",
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    marginTop: 20,
  },
  callingContainer: {
    alignItems: "center",
  },
  countdown: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000",
  },
  callingText: {
    fontSize: 18,
    color: "#000",
    marginTop: 10,
  },

  // Medicine List Styles
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8D7DA',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  checkbox: {
    marginRight: 10,
  },
  medText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  noMedsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginBottom: 15,
    paddingVertical: 5,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#777',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
});

export default styles;
