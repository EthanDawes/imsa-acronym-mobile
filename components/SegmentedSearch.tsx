import React, {useEffect, useState} from 'react';

import { View } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import {TextInput} from "./Themed";

type callback = (dropdown: string, textbox: string) => void;

interface Props {
  dropdownItems: string[];
  onInput: callback;
  placeholder?: string;
}

export default function SegmentedSearch({dropdownItems, onInput, placeholder}: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(dropdownItems.map(i => ({label: i, value: i})));
  const [dropdownValue, setDropdownValue] = useState(dropdownItems[0]);
  const [inputValue, setInputValue] = useState("");
  useEffect(onInput.bind(null, dropdownValue, inputValue),[dropdownValue, inputValue]);
  const roundness = 25;

  // TODO: don't use listmode=modal (currently b/c it doesn't overflow header. Maybe implement my own?)
  return (
    <View style={{flexDirection: "row"}}>
      <DropDownPicker
        open={open}
        value={dropdownValue}
        items={items}
        setOpen={setOpen}
        setValue={setDropdownValue}
        setItems={setItems}

        theme="DARK"
        listMode="MODAL"
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
          width: 200,
        }}
        onChangeText={setInputValue}
        value={inputValue}
        placeholder={placeholder}
      />
    </View>
  );
}
