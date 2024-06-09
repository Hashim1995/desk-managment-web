/* eslint-disable no-unused-vars */
import { RoomsService } from '@/services/rooms-services/rooms-services';
import { tokenizeImage } from '@/utils/functions/functions';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DateList from './date-list';
import DeskItem from './desk-item';
import { IRoomByIdResponse, IDesk } from './types';

export default function Home() {
  const [currentRoom, setCurrentRoom] = useState<IRoomByIdResponse>();
  const [deskList, setDeskList] = useState<IDesk[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [photoUrl, setPhotoUrl] = useState<string>('');
  const params = useParams();

  const [ownersCombo, setOwnersCombo] =
    useState<{ name: string; id: number }[]>();

  const fetchTokenizedImage = async (id: string) => {
    try {
      const tokenizedFile = await tokenizeImage({
        url: '',
        fileUrl: `${import.meta.env.VITE_BASE_URL}Files/${id}`
      });

      console.log(tokenizedFile, 'test99');
      setPhotoUrl(tokenizedFile?.url || '');
    } catch (err) {
      console.log(err);
    }
  };

  async function getOwnerCombo() {
    try {
      const res = await RoomsService.getInstance().getOwnerComboList();
      if (res) {
        setOwnersCombo(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getRoom() {
    try {
      const res = await RoomsService.getInstance().getRoomById(7);
      console.log(res, 'akif');
      if (res?.roomId) {
        setCurrentRoom(res);
        setDeskList(res?.desks);
        res?.photoFileId && fetchTokenizedImage(res?.photoFileId?.toString());
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getOwnerCombo();
    getRoom();
  }, []);
  return (
    <>
      <DateList />
      <div className="flex justify-center items-center">
        <div
          id="canvas"
          style={{
            backgroundRepeat: 'no-repeat'
          }}
          className="relative bg-gray-100 border w-[1400px] h-[800px] overflow-auto"
        >
          <img
            alt=""
            src={photoUrl}
            className="absolute inset-0 o object-contain"
          />
          {deskList.map(desk => (
            <DeskItem key={desk?.clientId || desk?.deskId} desk={desk} />
          ))}
        </div>
      </div>
    </>
  );
}
