import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <Pagination className="mt-4 justify-content-center">
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
      </PaginationItem>
      {[...Array(totalPages)].map((_, index) => (
        <PaginationItem active={index + 1 === currentPage} key={index}>
          <PaginationLink onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem disabled={currentPage === totalPages}>
        <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
      </PaginationItem>
    </Pagination>
  );
};

export default PaginationControls;
