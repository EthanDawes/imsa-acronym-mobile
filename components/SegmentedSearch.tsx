import React, {useEffect, useState} from 'react';

import {View} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import {TextInput} from "./Themed";
import useColorScheme from "../hooks/useColorScheme";

interface Props<T extends readonly string[]> {
  dropdownItems: T;
  onInput: (textbox: string, dropdown: T[number]) => void;
  placeholder?: string;
}

export default function SegmentedSearch<T extends readonly string[]>({dropdownItems, onInput, placeholder}: Props<T>) {
  const colorScheme = useColorScheme();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(dropdownItems.map(i => ({label: i, value: i})));
  const [dropdownValue, setDropdownValue] = useState(dropdownItems[0]);
  const [inputValue, setInputValue] = useState("");
  useEffect(onInput.bind(null, inputValue, dropdownValue),[dropdownValue, inputValue]);
  const roundness = 25;

  // Native StackNavigator causes dropdown to be cut off
  return (
    <View style={{flexDirection: "row"}}>
      <DropDownPicker
        open={open}
        value={dropdownValue}
        items={items}
        setOpen={setOpen}
        setValue={setDropdownValue}
        setItems={setItems}

        theme={colorScheme.toUpperCase() as any}
        style={{
          borderRadius: 0,
          borderTopLeftRadius: roundness,
          borderBottomLeftRadius: roundness,
        }}
        containerStyle={{
          width: 130,
        }}
        dropDownContainerStyle={{}}
      />
      <TextInput
        style={{
          borderRadius: 0,
          borderTopRightRadius: roundness,
          borderBottomRightRadius: roundness,
          borderWidth: 1,
          borderLeftWidth: 0,
          borderStyle: "solid",
          borderColor: colorScheme === "light" ? "black" : "#292d3e",
          width: 200,
          paddingLeft: 5,
        }}
        onChangeText={setInputValue}
        value={inputValue}
        placeholder={placeholder}
      />
    </View>
  );
}
