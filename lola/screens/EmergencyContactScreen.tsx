import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import styles from "../styles/registrationStyles";

type RootStackParamList = {
  Home: undefined;
};

type Contact = {
  id: number;
  name: string;
  relationship: string;
  phone: string;
};

const EmergencyContactsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "", relationship: "", phone: "" },
  ]);
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    [key: string]: { name: boolean; relationship: boolean; phone: boolean };
  }>({
    1: { name: false, relationship: false, phone: false },
  });

  // Load existing contacts on mount
  useEffect(() => {
    fetchExistingContacts();
  }, []);

  // Fetch existing contacts from database
  const fetchExistingContacts = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      if (!user) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching contacts:", error);
        return;
      }

      if (data && data.length > 0) {
        // Transform data from Supabase to match our Contact type
        const formattedContacts: Contact[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          relationship: item.relationship,
          phone: item.phone,
        }));
        setContacts(formattedContacts);
        
        // Set up errors object for validation
        const newErrors: any = {};
        formattedContacts.forEach(contact => {
          newErrors[contact.id] = { name: false, relationship: false, phone: false };
        });
        setErrors(newErrors);
      }
    } catch (error) {
      console.error("Error in fetchExistingContacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update contact information
  const updateContact = (id: number, field: string, value: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );

    // Clear error for this field if it has a value
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: { ...prevErrors[id], [field]: false },
      }));
    }
  };

  // Add new contact
  const addNewContact = () => {
    if (contacts.length >= 3) {
      Alert.alert("Limit Reached", "You can add up to 3 emergency contacts.");
      return;
    }

    const newContact = {
      id: Date.now(),
      name: "",
      relationship: "",
      phone: "",
    };

    setContacts([...contacts, newContact]);
    setErrors({
      ...errors,
      [newContact.id]: { name: false, relationship: false, phone: false },
    });
  };

  // Remove contact
  const removeContact = (id: number) => {
    if (contacts.length === 1) {
      Alert.alert("Required", "At least one emergency contact is required.");
      return;
    }

    setContacts(contacts.filter((contact) => contact.id !== id));

    // Remove errors for this contact
    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  // Validate phone number
  const validatePhone = (phone: string) => {
    return /^(9\d{9})$/.test(phone);
  };

  // Validate all fields
  const validateFields = () => {
    let isValid = true;
    const newErrors = { ...errors };

    contacts.forEach((contact) => {
      const contactErrors = {
        name: contact.name.trim() === "",
        relationship: contact.relationship.trim() === "",
        phone: contact.phone.trim() === "" || !validatePhone(contact.phone),
      };

      newErrors[contact.id] = contactErrors;

      if (contactErrors.name || contactErrors.relationship || contactErrors.phone) {
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Get current user
  const getCurrentUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting user:", error);
      return null;
    }

    return user;
  };

  // Save and Navigate
  const handleSave = async () => {
    if (!validateFields()) {
      Alert.alert("Validation Error", "Please correct the errors in the form.");
      return;
    }

    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      if (!user) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      // First, delete existing contacts for this user (to avoid duplicates)
      const { error: deleteError } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Error deleting existing contacts:", deleteError);
        Alert.alert("Error", "Failed to update emergency contacts");
        return;
      }

      // Then insert the new/updated contacts
      const contactsToInsert = contacts.map(contact => ({
        user_id: user.id,
        name: contact.name.trim(),
        relationship: contact.relationship.trim(),
        phone: contact.phone.trim(),
      }));

      const { error: insertError } = await supabase
        .from("emergency_contacts")
        .insert(contactsToInsert);

      if (insertError) {
        console.error("Error inserting contacts:", insertError);
        Alert.alert("Error", "Failed to save emergency contacts");
        return;
      }

      // Update user profile to mark emergency contacts as completed
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ emergency_contacts_completed: true })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        // Continue anyway as contacts were saved
      }

      Alert.alert(
        "Success",
        "Emergency contacts saved successfully",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    } catch (error) {
      console.error("Error in handleSave:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderContactForm = (contact: Contact, index: number) => {
    return (
      <View key={contact.id} style={styles.contactContainer}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactTitle}>Contact {index + 1}</Text>
          {contacts.length > 1 && (
            <TouchableOpacity
              onPress={() => removeContact(contact.id)}
              style={styles.removeButton}
            >
              <AntDesign name="close" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, errors[contact.id]?.name && styles.inputError]}
            placeholder="Enter full name"
            value={contact.name}
            onChangeText={(text) => updateContact(contact.id, "name", text)}
          />
          {errors[contact.id]?.name && (
            <Text style={styles.errorText}>Name is required</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Relationship</Text>
          <TextInput
            style={[styles.input, errors[contact.id]?.relationship && styles.inputError]}
            placeholder="e.g. Parent, Spouse, Friend"
            value={contact.relationship}
            onChangeText={(text) => updateContact(contact.id, "relationship", text)}
          />
          {errors[contact.id]?.relationship && (
            <Text style={styles.errorText}>Relationship is required</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors[contact.id]?.phone && styles.inputError]}
            placeholder="9XXXXXXXXX"
            keyboardType="phone-pad"
            value={contact.phone}
            onChangeText={(text) => updateContact(contact.id, "phone", text)}
            maxLength={10}
          />
          {errors[contact.id]?.phone && (
            <Text style={styles.errorText}>Valid phone number is required (should start with 9 and be 10 digits)</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.infoText}>
            Add at least one emergency contact that we can reach out to in case of 
            an emergency. You can add up to 3 contacts.
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <>
              {contacts.map((contact, index) => renderContactForm(contact, index))}

              {contacts.length < 3 && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addNewContact}
                >
                  <AntDesign name="plus" size={20} color="#007AFF" />
                  <Text style={styles.addButtonText}>Add Another Contact</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isClicked && styles.saveButtonClicked,
                ]}
                onPress={() => {
                  setIsClicked(true);
                  setTimeout(() => {
                    setIsClicked(false);
                    handleSave();
                  }, 200);
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmergencyContactsScreen;