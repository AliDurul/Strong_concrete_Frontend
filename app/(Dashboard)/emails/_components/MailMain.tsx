'use client'
import { useState, useEffect, PropsWithChildren } from 'react';
import 'tippy.js/dist/tippy.css';
import 'react-quill-new//dist/quill.snow.css';
import { Email } from '@/types/types';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectEmails, selectFolderId, selectFolders, selectIsShowMailMenu, selectSelectedTab, setIds, setIsShowMailMenu, setPagedMails } from '@/lib/features/email/emailSlice';
import MailSubMenu from './MailSubMenu';
import MailRightBox from './MailRightBox';

const MailMain = ({ children }: PropsWithChildren) => {

    const dispatch = useAppDispatch()
    const data = useAppSelector(selectEmails);
    const folders = useAppSelector(selectFolders);
    const folderId = useAppSelector(selectFolderId);
    const isShowMailMenu = useAppSelector(selectIsShowMailMenu);
    const selectedTab = useAppSelector(selectSelectedTab);

    const [mailList, setMailList] = useState<Email[]>(data);
    const [filteredMailList, setFilteredMailList] = useState<any>(mailList);
    const [searchText, setSearchText] = useState<any>('');


    useEffect(() => {
        setFilteredMailList(data)
        setMailList(data)
    }, [data]);

    const [pager] = useState<any>({
        currentPage: 1,
        totalPages: 0,
        pageSize: 15,
        startIndex: 0,
        endIndex: 0,
    });

    const searchMails = (isResetPage = true) => {
        if (isResetPage) {
            pager.currentPage = 1;
        }
        let res;
        if (selectedTab === 'normal' || selectedTab === 'low' || selectedTab === 'high') {

            res = mailList?.filter((d) => d.importance === selectedTab);
            console.log(res);

        } else {
            res = mailList
        }
        let filteredRes
        if (selectedTab !== 'Drafts') {
            filteredRes = res?.filter(
                (d) =>
                    (d.from?.emailAddress && d.from?.emailAddress?.address.toLowerCase().includes(searchText)) ||
                    (d.sender?.emailAddress?.name && d.sender?.emailAddress?.name.toLowerCase().includes(searchText)) ||
                    (d.subject && d.subject.toLowerCase().includes(searchText))
            );
        } else {
            filteredRes = res
        }


        setFilteredMailList(res ? [...res.filter(
            (d) =>
                (d.from?.emailAddress && d.from?.emailAddress?.address.toLowerCase().includes(searchText)) ||
                (d.sender?.emailAddress?.name && d.sender?.emailAddress?.name.toLowerCase().includes(searchText)) ||
                (d.subject && d.subject.toLowerCase().includes(searchText))
        ),] : []);

        if (filteredRes?.length) {
            pager.totalPages = pager.pageSize < 1 ? 1 : Math.ceil(filteredRes?.length / pager.pageSize);
            if (pager.currentPage > pager.totalPages) {
                pager.currentPage = 1;
            }
            pager.startIndex = (pager.currentPage - 1) * pager.pageSize;
            pager.endIndex = Math.min(pager.startIndex + pager.pageSize - 1, filteredRes?.length - 1);
            dispatch(setPagedMails([...filteredRes?.slice(pager.startIndex, pager.endIndex + 1)]));
        } else {
            setPagedMails([]);
            pager.startIndex = -1;
            pager.endIndex = -1;
        }

        clearSelection();
    };

    useEffect(() => {
        searchMails();
    }, [selectedTab, searchText, mailList, folderId]);


    /*   const setGroup = (group: any) => {
          if (ids.length) {
              let items = mailList.filter((d: any) => ids.includes(d.id));
              for (let item of items) {
                  item.group = group;
              }
  
              showMessage(ids.length + ' Mail has been grouped as ' + group.toUpperCase());
              clearSelection();
              setTimeout(() => {
                  searchMails(false);
              });
          }
      }; */



    const clearSelection = () => {
        dispatch(setIds([]));
    };



    return (

        <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)] pt-5">
            <div
                className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowMailMenu ? '!block xl:!hidden' : ''}`}
                onClick={() => dispatch(setIsShowMailMenu(!isShowMailMenu))}
            ></div>
            <MailSubMenu />
            <MailRightBox
                pager={pager}
                setMailList={setMailList}
                searchText={searchText}
                filteredMailList={filteredMailList}
                searchMails={searchMails}
                clearSelection={clearSelection}
                setSearchText={setSearchText}
            >
                {children}
            </MailRightBox>
        </div>

    );
};

export default MailMain;