
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Update the theme to use an orange/amber color palette and a serif font (similar to your login page)
const theme = createTheme({
  palette: {
    primary: {
      main: '#EA580C', // similar to Tailwind's orange-600
    },
    secondary: {
      main: '#F59E0B', // an amber tone
    },
  },
  typography: {
    fontFamily: 'Merriweather, serif', // a classic serif font
  },
});

const BookCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const BookHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '12px 12px 0 0',
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  padding: theme.spacing(1),
}));

// BooksPage uses Material UI components for the layout and accordions
const BooksPage = ({ books }) => {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            mt: 4,
            mb: 6,
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          Published Books
        </Typography>

        {books.map((book, index) => (
          <BookCard key={index}>
            <BookHeader
              title={
                <Typography variant="h4" component="div">
                  {book.title}
                </Typography>
              }
              subheader={
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  By {book.author}
                </Typography>
              }
              action={<PriceChip label={`Price: ${book.price}`} />}
            />

            <CardContent>
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {book.description}
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Book Details
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Genre: {book.genre}
                    <br />
                    ISBN: {book.isbn}
                    <br />
                    Pages: {book.pages}
                    <br />
                    Cover: {book.cover}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Marketplace Links
                  </Typography>
                  {book.marketplaceLinks.map((link, i) => (
                    <Chip
                      key={i}
                      label={link}
                      sx={{ m: 0.5 }}
                      color="primary"
                      variant="outlined"
                      clickable
                    />
                  ))}
                </Grid>
              </Grid>

              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 'bold' }}>Publishing Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
                        <TableRow>
                          {[
                            'Edition Date',
                            'Quantity',
                            'MRP',
                            'Royalty (%)',
                            'Sold',
                            'Royalty Earned',
                          ].map((header, i) => (
                            <TableCell key={i} sx={{ color: 'white' }}>
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {book.publishingDetails.map((detail, i) => (
                          <TableRow key={i}>
                            <TableCell>{detail.editionDate}</TableCell>
                            <TableCell>{detail.quantity}</TableCell>
                            <TableCell>{detail.mrp}</TableCell>
                            <TableCell>{detail.royalty}</TableCell>
                            <TableCell>{detail.sold}</TableCell>
                            <TableCell>{detail.royaltyEarned}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>

              {book.authorsPurchase && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 'bold' }}>Authors Purchase</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
                          <TableRow>
                            {[
                              'Date',
                              'Particulars',
                              'Quantity',
                              'MRP',
                              'Discount',
                              'Total',
                              'Payment Status',
                            ].map((header, i) => (
                              <TableCell key={i} sx={{ color: 'white' }}>
                                {header}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {book.authorsPurchase.map((purchase, i) => (
                            <TableRow key={i}>
                              <TableCell>{purchase.date}</TableCell>
                              <TableCell>{purchase.particulars}</TableCell>
                              <TableCell>{purchase.quantity}</TableCell>
                              <TableCell>{purchase.mrp}</TableCell>
                              <TableCell>{purchase.discount}</TableCell>
                              <TableCell>{purchase.total}</TableCell>
                              <TableCell>{purchase.paymentStatus}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              )}
            </CardContent>
          </BookCard>
        ))}
      </Container>
    </ThemeProvider>
  );
};

// Sample data structure (update or expand with your real data)
const booksData = [
  {
    title: 'Your Daily Astrological Guide [English]',
    author: 'Jay Yadav',
    price: '₹150',
    description: 'A concise guide to understanding your daily astrological forecast.',
    genre: 'Astrology',
    isbn: '9788198388094',
    pages: 68,
    cover: 'Paperback',
    marketplaceLinks: ['Amazon', 'Flipkart'],
    publishingDetails: [
      {
        editionDate: '07 Jan 2025',
        quantity: 7,
        mrp: '₹150',
        royalty: '20%',
        sold: 0,
        royaltyEarned: '₹0',
      },
    ],
    authorsPurchase: [
      {
        date: '07 Jan 2025',
        particulars: 'Complimentary Copies',
        quantity: 5,
        mrp: '₹150',
        discount: '100%',
        total: '₹0',
        paymentStatus: 'Paid',
      },
    ],
  },
  // You can add additional books here...
];

export default function App() {
  return (
    // The outer div uses a gradient background similar to your login page design
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <BooksPage books={booksData} />
    </div>
  );
}
