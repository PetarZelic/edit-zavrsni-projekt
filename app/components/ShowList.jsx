'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';
import fetchAllShows from './fetchAllShows';

const ITEMS_PER_PAGE = 20;

import { useSearchParams } from 'next/navigation';

export default function ShowList() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [shows, setShows] = useState([]);
  const [pageNums, setPageNums] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchedShow, setSearchedShow] = useState('');
  const [searchedResult, setSearchedResult] = useState('');

  useEffect(() => {
    const fetchShows = async () => {
      const data = await fetchAllShows(10);
      const sorted = [...data];

      if (sortOrder === 'asc' || sortOrder === 'desc') {
        sorted.sort((a, b) => {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return sortOrder === 'asc'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        });
      } else if (sortOrder === 'newest') {
        sorted.sort((a, b) => {
          const dateA = new Date(a.premiered || '1900-01-01').getTime();
          const dateB = new Date(b.premiered || '1900-01-01').getTime();
          return dateB - dateA;
        });
      } else if (sortOrder === 'rating') {
        sorted.sort((a, b) => {
          const ratingA = a.rating?.average || 0;
          const ratingB = b.rating?.average || 0;
          return ratingB - ratingA;
        });
      }

      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      setShows(sorted.slice(start, end));

      const startPage = Math.max(1, currentPage - 2);
      const newPageNums = Array.from({ length: 5 }, (_, i) => startPage + i);
      setPageNums(newPageNums);
    };

    fetchShows();
  }, [currentPage, sortOrder]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchedShow(query);

    if (query.trim() === '') {
      setSearchedResult('');
      return;
    }

    try {
      const res = await fetch(
        `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query)}`
      );
      if (res.ok) {
        const data = await res.json();
        setSearchedResult(data);
      } else {
        setSearchedResult('');
      }
    } catch (error) {
      console.error('Error fetching show:', error);
      setSearchedResult('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">TV Show List</h2>

      <div className="mb-4">
        <label htmlFor="sortOrder" className="mr-2 font-semibold">
          Sortiraj:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded px-2 py-1 mr-4"
        >
          <option value="asc">A - Ž</option>
          <option value="desc">Ž - A</option>
          <option value="newest">Najnovije</option>
          <option value="rating">Po ocjeni</option>
        </select>

        <input
          type="text"
          onChange={handleSearch}
          value={searchedShow}
          placeholder="Pretraži seriju..."
          className="border px-2 py-1 rounded w-64"
        />
      </div>

      {searchedResult && typeof searchedResult !== 'string' ? (
        <ul className="grid grid-cols-2 gap-4">
          <li key={searchedResult.id} className="border p-5 rounded relative">
            <Link href={`/shows/${searchedResult.id}`}>
              {searchedResult.image?.medium ? (
                <Image
                  src={searchedResult.image.medium}
                  alt={searchedResult.name}
                  width={200}
                  height={200}
                  priority
                />
              ) : (
                <p>No image</p>
              )}
              <h3 className="text-2xl font-bold">{searchedResult.name}</h3>
            </Link>
            <FavoriteButton
              item={{
                id: searchedResult.id,
                name: searchedResult.name,
                image: searchedResult.image,
                type: 'show',
              }}
            />
          </li>
        </ul>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {shows.map((show, index) => (
            <li key={show.id} className="border p-2 rounded relative">
              <Link href={`/shows/${show.id}`}>
                {show.image?.medium ? (
                  <Image
                    src={show.image.medium}
                    alt={show.name}
                    width={200}
                    height={200}
                    priority={index < 4}
                  />
                ) : (
                  <p>No image</p>
                )}
                <h3>{show.name}</h3>
              </Link>
              <FavoriteButton
                item={{
                  id: show.id,
                  name: show.name,
                  image: show.image,
                  type: 'show',
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center items-center gap-2 mt-10">
        <Link
          href={`/?page=${currentPage - 1}`}
          className={`px-4 py-2 bg-red-500 rounded ${
            currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          Previous
        </Link>

        {currentPage > 3 && (
          <Link
            href="/?page=1"
            className="px-3 py-1 bg-red-100 rounded hover:bg-red-300"
          >
            1...
          </Link>
        )}

        {pageNums.map((el) => (
          <Link
            key={el}
            href={`/?page=${el}`}
            className={`px-3 py-1 rounded ${
              el === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-black-100 hover:bg-white-300'
            }`}
          >
            {el}
          </Link>
        ))}

        <Link
          href={`/?page=${currentPage + 1}`}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
